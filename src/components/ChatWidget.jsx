import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiGet, apiPost } from '../lib/api'

export default function ChatWidget() {
  const { user, token } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)
  const isAdmin = user?.role === 'admin'

  // Auto scroll ke bawah saat ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch messages (optimized - hanya ambil pesan baru jika sudah ada pesan)
  const fetchMessages = async (incremental = false, lastMessageId = 0) => {
    if (!token) return
    
    try {
      let url = '/api/chat?limit=30'
      if (incremental && lastMessageId > 0) {
        // Ambil hanya pesan baru setelah ID terakhir
        url = `/api/chat?since_id=${lastMessageId}&limit=50`
      }
      
      const data = await apiGet(url)
      if (data && data.length > 0) {
        if (incremental) {
          // Tambahkan pesan baru ke array yang ada
          setMessages(prev => [...prev, ...data])
        } else {
          setMessages(data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // Fetch unread count (untuk admin)
  const fetchUnreadCount = async () => {
    if (!token || !isAdmin) return
    
    try {
      const data = await apiGet('/api/chat/unread-count')
      setUnreadCount(data.count || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  // Load messages saat chat dibuka
  useEffect(() => {
    if (isOpen && token) {
      fetchMessages(false) // Load initial messages
      // Polling setiap 5 detik untuk update pesan baru (dioptimalkan dari 2 detik)
      const interval = setInterval(() => {
        // Ambil ID pesan terakhir untuk incremental fetch
        const lastId = messages.length > 0 ? Math.max(...messages.map(m => m.id || 0)) : 0
        fetchMessages(true, lastId) // Incremental fetch
        if (isAdmin) {
          fetchUnreadCount()
        }
      }, 5000) // Diubah dari 2000ms ke 5000ms untuk mengurangi load
      
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token, isAdmin])

  // Polling unread count untuk admin (bahkan saat chat tertutup) - dioptimalkan
  useEffect(() => {
    if (token && isAdmin) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 10000) // Diubah dari 5 detik ke 10 detik
      return () => clearInterval(interval)
    }
  }, [token, isAdmin])

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending || !token) return

    setSending(true)
    try {
      await apiPost('/api/chat', { message: newMessage })
      setNewMessage('')
      // Refresh messages setelah kirim (incremental)
      setTimeout(() => {
        fetchMessages(true) // Incremental fetch untuk efisiensi
        if (isAdmin) {
          fetchUnreadCount()
        }
      }, 300)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Gagal mengirim pesan: ' + error.message)
    } finally {
      setSending(false)
    }
  }

  // Format waktu
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Baru saja'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} menit lalu`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam lalu`
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Jika user belum login, jangan tampilkan chat
  if (!user || !token) {
    return null
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Buka Chat"
      >
        <svg
          className="w-6 h-6 text-slate-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {isAdmin && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-slate-900 font-bold text-lg">Live Chat</h3>
              <p className="text-slate-900/80 text-sm">
                {isAdmin ? 'Admin Support' : 'Customer Support'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-900 hover:text-slate-700 transition-colors"
              aria-label="Tutup Chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <p>Belum ada pesan</p>
                <p className="text-sm mt-2">Mulai percakapan dengan mengirim pesan!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.username === user.username
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900'
                          : msg.role === 'admin'
                          ? 'bg-gradient-to-tr from-purple-400 to-pink-400 text-slate-900'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      {!isOwnMessage && (
                        <div className="text-xs font-semibold mb-1 opacity-80">
                          {msg.username} {msg.role === 'admin' && '👑'}
                        </div>
                      )}
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/50 bg-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan..."
                disabled={sending}
                className="flex-1 rounded-lg border border-slate-400/30 bg-slate-700/70 px-4 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-semibold hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-900"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

