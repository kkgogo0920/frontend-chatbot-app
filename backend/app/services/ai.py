import yaml
from langdetect import detect
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain

from app.core.config import settings

class AIService:
    def __init__(self):
        # 加载提示配置
        with open('config/i18n/prompts.yml', 'r', encoding='utf-8') as file:
            self.prompts = yaml.safe_load(file)
            
        # 初始化OpenAI客户端
        self.llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model="gpt-3.5-turbo",
            temperature=0.7
        )
    
    def detect_language(self, text):
        """
        检测文本语言并返回对应的语言代码
        支持的语言：英语(en)、中文(zh)、日语(ja)、韩语(ko)
        """
        try:
            lang = detect(text)
            if lang == 'zh-cn' or lang == 'zh-tw':
                return 'zh'
            elif lang in ['en', 'ja', 'ko']:
                return lang
            return 'en'  # 默认使用英语
        except:
            return 'en'  # 检测失败时默认使用英语
    
    def get_prompt_by_language(self, text):
        """根据文本语言获取对应的提示模板"""
        lang = self.detect_language(text)
        prompts = self.prompts.get(lang, self.prompts['en'])
        
        system_prompt = prompts['system_prompt']['base']
        user_prompt = prompts['system_prompt']['user_prompt']
        
        return system_prompt, user_prompt
    
    def get_response(self, text, length='medium', force_language=None):
        """
        获取AI响应
        :param text: 输入文本
        :param length: 响应长度 ('short', 'medium', 'long')
        :param force_language: 强制使用特定语言回复 (None, 'en', 'zh', 'ja', 'ko')
        """
        # 检测语言并获取提示
        system_prompt, user_prompt_template = self.get_prompt_by_language(text)
        
        # 如果指定了强制使用的语言
        if force_language:
            language_instructions = {
                'en': "Please respond in English.",
                'zh': "请用中文回答。",
                'ja': "日本語で回答してください。",
                'ko': "한국어로 답변해 주세요."
            }
            system_prompt = system_prompt + "\n" + language_instructions.get(
                force_language,
                language_instructions['en']
            )
        
        # 设置最大令牌数
        max_tokens = {
            'short': 150,
            'medium': 300,
            'long': 600
        }[length]
        
        # 更新LLM配置
        self.llm.max_tokens = max_tokens
        
        # 创建提示模板
        prompt = PromptTemplate(
            template=user_prompt_template,
            input_variables=["text"]
        )
        
        # 创建链
        chain = LLMChain(
            llm=self.llm,
            prompt=prompt
        )
        
        # 获取响应
        response = chain.run(text=text)
        return response.strip()

# 创建AI服务实例
ai_service = AIService() 