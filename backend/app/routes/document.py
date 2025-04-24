from flask import Blueprint, request, jsonify
import os
from langchain_openai import ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document
from PyPDF2 import PdfReader
from ..utils.jwt_utils import token_required

document_bp = Blueprint('document', __name__)

# Configure OpenAI
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

def extract_text_from_pdf(file):
    """从PDF文件中提取文本"""
    try:
        pdf_reader = PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        if not text.strip():
            raise ValueError("无法从PDF中提取文本")
        return text
    except Exception as e:
        raise ValueError(f"处理PDF时出错: {str(e)}")

def get_summary(text, length="medium"):
    """使用 LangChain 生成文本摘要和关键点"""
    try:
        if not text.strip():
            raise ValueError("输入文本不能为空")
            
        if len(text) > 100000:  # 约25,000字
            raise ValueError("输入文本过长，请限制在25,000字以内")

        # 配置摘要长度
        max_tokens = {
            "short": 150,
            "medium": 250,
            "long": 350
        }.get(length, 250)

        # 初始化 LLM
        llm = ChatOpenAI(
            api_key=api_key,
            temperature=0.7,
            model="gpt-3.5-turbo",
            max_tokens=max_tokens
        )

        # 配置摘要提示词
        summary_template = """你是一个专业的文本摘要助手。请根据输入文本的语言提供相应的摘要。
如果输入是中文，用中文回复；如果是英文，用英文回复；如果是其他语言，保持原语言回复。
请生成一个简洁的摘要：

{text}

摘要:"""

        # 配置关键点提示词
        key_points_template = """你是一个专业的文本分析助手。请从以下文本中提取3-5个关键点，使用原文的语言：

{text}

关键点:"""

        # 创建摘要链
        summary_chain = LLMChain(
            llm=llm,
            prompt=PromptTemplate(
                template=summary_template,
                input_variables=["text"]
            )
        )

        # 创建关键点链
        key_points_chain = LLMChain(
            llm=llm,
            prompt=PromptTemplate(
                template=key_points_template,
                input_variables=["text"]
            )
        )

        # 生成摘要
        summary = summary_chain.run(text=text)

        # 生成关键点
        key_points_text = key_points_chain.run(text=text)
        key_points = [point.strip() for point in key_points_text.split('\n') if point.strip()]

        return {
            "summary": summary.strip(),
            "key_points": key_points
        }

    except Exception as e:
        raise ValueError(f"生成摘要时出错: {str(e)}")

@document_bp.route('/ai/summarize', methods=['POST'])
@token_required
def summarize(current_user):
    """文本摘要接口"""
    try:
        # 获取摘要长度参数
        length = request.form.get('length', request.json.get('length', 'medium'))
        if length not in ['short', 'medium', 'long']:
            return jsonify({"error": "无效的摘要长度"}), 400

        # 处理文件上传
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "未选择文件"}), 400

            if not file.filename.lower().endswith(('.pdf', '.txt')):
                return jsonify({"error": "仅支持 PDF 和 TXT 文件"}), 400

            if file.filename.lower().endswith('.pdf'):
                text = extract_text_from_pdf(file)
            else:
                text = file.read().decode('utf-8')
        else:
            # 从JSON中获取文本
            data = request.get_json()
            if not data or 'text' not in data:
                return jsonify({"error": "未提供文本"}), 400
            text = data['text']

        # 生成摘要
        result = get_summary(text, length)
        return jsonify(result)

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "服务器内部错误"}), 500

@document_bp.route('/ai/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({'status': 'ok'}) 