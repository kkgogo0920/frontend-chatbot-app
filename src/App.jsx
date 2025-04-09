import { useState } from 'react'
import { Layout } from '@arco-design/web-react'
import './App.css'
import Navbar from './components/Navbar'
import SideMenu from './components/SideMenu'
import ContentArea from './components/ContentArea'
import ChatbotIcon from './components/ChatbotIcon'
import ChatbotWindow from './components/ChatbotWindow'

const { Sider, Content } = Layout

function App() {
  const [activePage, setActivePage] = useState("0")
  const [searchQuery, setSearchQuery] = useState('')
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  
  const handleMenuClick = (menuItem) => {
    setActivePage(menuItem)
  }
  
  const handleSearch = (query) => {
    setSearchQuery(query)
  }
  
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen)
  }
  
  return (
    <Layout className="app-container">
      <Navbar onSearch={handleSearch} />
      <Layout>
        <Sider width={240} className="sider-container" style={{ background: '#f5f5f5' }}>
          <SideMenu activePage={activePage} onMenuClick={handleMenuClick} />
        </Sider>
        <Content>
          <ContentArea page={activePage} searchQuery={searchQuery} />
        </Content>
      </Layout>
      <ChatbotIcon onClick={toggleChatbot} />
      {isChatbotOpen && <ChatbotWindow onClose={() => setIsChatbotOpen(false)} />}
    </Layout>
  )
}

export default App