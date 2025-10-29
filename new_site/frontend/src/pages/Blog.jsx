import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getSocialIcon } from '../utils/icons.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState(null)
  const [siteData, setSiteData] = useState(null)
  const [socialNetworks, setSocialNetworks] = useState([])





  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, siteResponse, socialResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/posts'),
          axios.get('http://localhost:8000/api/site'),
          axios.get('http://localhost:8000/api/social-networks')
        ])
        setPosts(postsResponse.data || [])
        setSiteData(siteResponse.data)
        setSocialNetworks(socialResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const openModal = (postId) => {
    setActiveModal(postId)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setActiveModal(null)
    document.body.style.overflow = 'auto'
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal')) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <>
      <main id="top">
        <div className="splash">
          <h1>Блог</h1>
          <h2>Мысли, заметки и путешествия</h2>
        </div>

        <div className="section">
          <div className="container mx-auto px-4">
            {posts.length === 0 ? (
              <Card className="max-w-md mx-auto bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <p className="text-slate-400 mb-4">В блоге пока нет записей</p>
                  <Badge variant="outline" className="border-primary text-primary">
                    Скоро появятся новые статьи
                  </Badge>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {posts.map(post => (
                  <Card key={post.id} className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-white mb-2 leading-tight">
                            <div dangerouslySetInnerHTML={{ __html: post.title }} />
                          </CardTitle>
                          {post.published_at && (
                            <CardDescription className="text-slate-400">
                              {formatDate(post.published_at)}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          Статья
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                        <div dangerouslySetInnerHTML={{ 
                          __html: post.content.length > 200 
                            ? post.content.substring(0, 200) + '...' 
                            : post.content 
                        }} />
                      </div>
                      <Button 
                        onClick={() => openModal(post.id)}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Читать полностью
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Контакты</h4>
              <div className="contact-info">
                {siteData?.email && siteData.email.trim() !== '' && (
                  <a href={`mailto:${siteData.email}`} className="contact-item">
                    {getSocialIcon('email')}
                    {siteData.email}
                  </a>
                )}
                {socialNetworks
                  .filter(social => social.show_in_footer)
                  .sort((a, b) => a.order - b.order)
                  .map(social => (
                    <a 
                      key={social.id} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener" 
                      className="contact-item"
                    >
                      {getSocialIcon(social.icon_name)}
                      {social.name}
                    </a>
                  ))
                }
              </div>
            </div>
            <div className="footer-section">
              <h4>Навигация</h4>
              <div className="footer-links">
                <a href="/">Главная</a>
                <a href="/blog">Блог</a>
                <a href="/goals">Цели</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Иванцов Никита. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Модальные окна для постов */}
      {posts.map(post => (
        activeModal === post.id && (
          <div key={post.id} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-700">
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white pr-8">
                    <div dangerouslySetInnerHTML={{ __html: post.title }} />
                  </CardTitle>
                  {post.published_at && (
                    <CardDescription className="text-slate-400 mt-2">
                      {formatDate(post.published_at)}
                    </CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModal}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )
      ))}
    </>
  )
}

export default Blog