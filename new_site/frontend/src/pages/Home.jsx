import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getSocialIcon } from '../utils/icons.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


const Home = () => {
  const [siteData, setSiteData] = useState(null)
  const [socialNetworks, setSocialNetworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState(null)



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteResponse, socialResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/site'),
          axios.get('http://localhost:8000/api/social-networks')
        ])
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

  const openModal = (modalId) => {
    setActiveModal(modalId)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setActiveModal(null)
    document.body.style.overflow = 'auto'
  }

  const formatAboutText = (text) => {
    if (!text) return ''
    // Разбиваем текст по двойным переносам строк и оборачиваем в теги <p>
    return text
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('')
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

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <>
      <main id="top">
        <div className="splash home-hero">
          <div className="flux-container">
            <div className="flux-line"></div>
            <div className="flux-line"></div>
            <div className="flux-line"></div>
            <div className="flux-line"></div>
            <div className="flux-line"></div>
            <div className="flux-line"></div>
          </div>
          <div className="tenor-gif-container">
            <div className="tenor-gif-embed" data-postid="13289613" data-share-method="host" data-aspect-ratio="1.77778" data-width="100%" data-height="100%">
              <iframe 
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen={true} 
                scrolling="no" 
                width="100%" 
                height="100%" 
                src="https://tenor.com/embed/13289613"
              />
            </div>
          </div>
          
          <div className="glitch-container">
            <img 
              className="profile-picture" 
              src={siteData?.profile_image ? `http://localhost:8000${siteData.profile_image}` : "/profile.jpg"} 
              alt="Профиль" 
            />
          </div>
          
          <h1>{siteData?.hero_title || "Иванцов Никита"}</h1>
          <h2>{siteData?.hero_subtitle || "Студент, Программист, Разработчик"}</h2>
          
          <div className="socials">
            {/* Статические социальные сети из настроек сайта */}
            <a 
              href={siteData?.github_url || "https://github.com/atikin900"} 
              target="_blank" 
              rel="noopener" 
              className="social-icon" 
              title="GitHub: atikin900"
            >
              {getSocialIcon('github')}
            </a>
            <a 
              href={siteData?.telegram_url || "https://t.me/atikin90"} 
              target="_blank" 
              rel="noopener" 
              className="social-icon" 
              title="Telegram: @atikin90"
            >
              {getSocialIcon('telegram')}
            </a>
            {siteData?.email && siteData.email.trim() !== '' && (
              <a 
                href={`mailto:${siteData.email}`} 
                target="_blank" 
                rel="noopener" 
                className="social-icon" 
                title="Email"
              >
                {getSocialIcon('email')}
              </a>
            )}
            
            {/* Динамические социальные сети с show_in_header: true (исключая дублирование) */}
            {socialNetworks
              .filter(social => social.show_in_header)
              .filter(social => !['github', 'telegram', 'email'].includes(social.icon_name)) // Исключаем дублирование
              .sort((a, b) => a.order - b.order)
              .map(social => (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener" 
                  className="social-icon" 
                  title={social.name}
                >
                  {getSocialIcon(social.icon_name)}
                </a>
              ))
            }
            <div className="social-glow"></div>
          </div>
        </div>

        <div className="section" id="about-me">
          <div className="container">
            <div className="section-corner top-left"></div>
            <div className="section-corner top-right"></div>
            <div className="section-corner bottom-left"></div>
            <div className="section-corner bottom-right"></div>
            <div 
              dangerouslySetInnerHTML={{ 
                __html: formatAboutText(siteData?.about_text) || `
                  <p><strong>Привет!</strong></p>
                  <p>Я обладаю высокой организованностью и ответственностью, что позволяет мне эффективно работать в команде. Мой отличительной чертой является трудолюбие и развитые аналитические способности, особенно в области программирования.</p>
                  <p>В настоящее время я учусь на третьем курсе по специальности «Информационные системы и программирование». Мой опыт включает в себя навыки работы с Python, 1С, HTML и базовые представления о Машинном обучении.</p>
                  <p>Кроме того, я с большим удовольствием осваиваю Photoshop и программы для видеомонтажа.</p>
                `
              }} 
            />
          </div>
        </div>

        {/* Секция Портфолио */}
        <div className="section-title" id="portfolio">
          <div className="cyber-grid"></div>
          <div className="cyber-accent"></div>
          <h2>Портфолио</h2>
          <svg className="design-element" width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 5L55 30L30 55L5 30L30 5Z" stroke="#ff003c" strokeWidth="1" fill="none" />
            <path d="M30 15L45 30L30 45L15 30L30 15Z" stroke="#ff003c" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="section">
          <div className="container">
            <h3>Мои лучшие проекты</h3>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50 backdrop-blur-sm hover:border-blue-500/70 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
                      <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                  </div>
                  <Badge variant="outline" className="mb-2 border-blue-400 text-blue-400">
                    Веб-сайт
                  </Badge>
                  <CardTitle className="text-white text-lg">
                    Локальный хешированный сайт
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 mb-4 leading-relaxed">
                    Разработка локального захешированного сайта в рамках курсовой работы. Проект включал в себя создание системы авторизации, хранение данных и обеспечение безопасности.
                  </CardDescription>
                  <Button 
                    onClick={() => openModal('site-modal')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="group bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700/50 backdrop-blur-sm hover:border-red-500/70 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
                      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                    </svg>
                  </div>
                  <Badge variant="outline" className="mb-2 border-red-400 text-red-400">
                    Бот для Telegram
                  </Badge>
                  <CardTitle className="text-white text-lg">
                    Телеграм боты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 mb-4 leading-relaxed">
                    Разработка различных ботов для Telegram на языке Python. Реализация функционала для автоматизации задач и улучшения пользовательского опыта.
                  </CardDescription>
                  <Button 
                    onClick={() => openModal('bot-modal')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="group bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50 backdrop-blur-sm hover:border-purple-500/70 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400">
                      <path d="M12 17.56L16.07 16.43L16.62 10.33H9.38L9.2 8.3H16.8L17 6.31H7L7.56 12.32H14.45L14.22 14.9L12 15.5L9.78 14.9L9.64 13.24H7.64L7.93 16.43L12 17.56M4.07 3H19.93L18.5 19.2L12 21L5.5 19.2L4.07 3Z" />
                    </svg>
                  </div>
                  <Badge variant="outline" className="mb-2 border-purple-400 text-purple-400">
                    HTML, CSS, JavaScript
                  </Badge>
                  <CardTitle className="text-white text-lg">
                    Веб-разработка
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 mb-4 leading-relaxed">
                    Создание различных сайтов с использованием HTML, CSS и JavaScript. Разработка как простых статических страниц, так и более сложных веб-приложений.
                  </CardDescription>
                  <Button 
                    onClick={() => openModal('web-modal')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            </div>

            <h3>Хронология</h3>

            <div className="timeline">
              <div className="timeline-element">
                <span className="timeline-element-icon" style={{backgroundColor: '#007396', color: '#fff'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.14,7.5A2.86,2.86 0 0,1 22,10.36V14.14A2.86,2.86 0 0,1 19.14,17H12C12,17.39 12.32,17.96 12.71,17.96H17V19.64A2.36,2.36 0 0,1 14.64,22H9.36A2.36,2.36 0 0,1 7,19.64V17.96H11.29C11.68,17.96 12,17.39 12,17H4.86A2.86,2.86 0 0,1 2,14.14V10.36A2.86,2.86 0 0,1 4.86,7.5H19.14M4.86,9.18C4.33,9.18 3.89,9.62 3.89,10.15V14.35C3.89,14.88 4.33,15.32 4.86,15.32H19.14C19.67,15.32 20.11,14.88 20.11,14.35V10.15C20.11,9.62 19.67,9.18 19.14,9.18H4.86Z" />
                  </svg>
                </span>
                <div className="timeline-element-content">
                  <h4>Начало обучения программированию</h4>
                  <h5>Знакомство с Python</h5>
                  <div>
                    <p>Начал изучать программирование и познакомился с языком Python. Создал первые скрипты и небольшие программы.</p>
                  </div>
                  <span className="timeline-element-date">2020</span>
                </div>
              </div>
              
              <div className="timeline-element">
                <span className="timeline-element-icon" style={{backgroundColor: '#0088cc', color: '#fff'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                  </svg>
                </span>
                <div className="timeline-element-content">
                  <h4>Начало работы над телеграм-ботами</h4>
                  <h5>Первые боты на Python</h5>
                  <div>
                    <p>Начал разрабатывать ботов для Telegram на языке Python. Создал первые проекты для автоматизации задач и улучшения пользовательского опыта.</p>
                  </div>
                  <span className="timeline-element-date">2021</span>
                </div>
              </div>
              
              <div className="timeline-element">
                <span className="timeline-element-icon" style={{backgroundColor: '#ffffff', color: '#000'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
                  </svg>
                </span>
                <div className="timeline-element-content">
                  <h4>Расширение навыков</h4>
                  <h5>Изучение новых технологий</h5>
                  <div>
                    <p>Начал изучать 1С и основы машинного обучения. Также углубил свои знания в области веб-разработки.</p>
                  </div>
                  <span className="timeline-element-date">2022</span>
                </div>
              </div>
              
              <div className="timeline-element">
                <span className="timeline-element-icon" style={{backgroundColor: '#36b030', color: '#fff'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                  </svg>
                </span>
                <div className="timeline-element-content">
                  <h4>Развитие проектов</h4>
                  <h5>Улучшение телеграм-ботов</h5>
                  <div>
                    <p>Расширил функциональность ботов для Telegram. Научился работать с API и создавать более сложные инструменты для взаимодействия с пользователями.</p>
                  </div>
                  <span className="timeline-element-date">2023</span>
                </div>
              </div>
              
              <div className="timeline-element">
                <span className="timeline-element-icon" style={{backgroundColor: '#673ab7', color: '#fff'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z" />
                  </svg>
                </span>
                <div className="timeline-element-content">
                  <h4>Разработка программного обеспечения</h4>
                  <h5>Создание приложений для ПК</h5>
                  <div>
                    <p>Разработал несколько приложений для персональных компьютеров с использованием Python и фреймворка PyQt. Создал утилиты для автоматизации рабочих процессов и обработки данных.</p>
                  </div>
                  <span className="timeline-element-date">2024</span>
                </div>
              </div>
              
              <div className="timeline-element">
                <span className="timeline-element-icon" style={{backgroundColor: '#ff5722', color: '#fff'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                </span>
                <div className="timeline-element-content">
                  <h4>Современные веб-технологии</h4>
                  <h5>React и современная веб-разработка</h5>
                  <div>
                    <p>Изучил современные веб-технологии, включая React, Node.js и современные инструменты разработки. Создал этот персональный сайт с админ-панелью.</p>
                  </div>
                  <span className="timeline-element-date">2025</span>
                </div>
              </div>
            </div>
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
                <a href="#top">Главная</a>
                <a href="#about-me">О себе</a>
                <a href="#portfolio">Портфолио</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Иванцов Никита. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Модальные окна */}
      {activeModal === 'site-modal' && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Локальный хешированный сайт</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Курсовая работа по созданию локального веб-сайта с системой хеширования данных.</p>
              <h4>Особенности проекта:</h4>
              <ul>
                <li>Система авторизации пользователей</li>
                <li>Хеширование паролей для безопасности</li>
                <li>Локальное хранение данных</li>
                <li>Адаптивный дизайн</li>
                <li>Валидация форм на клиентской стороне</li>
              </ul>
              <h4>Технологии:</h4>
              <p>HTML, CSS, JavaScript, PHP, MySQL</p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'bot-modal' && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Телеграм боты</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Разработка различных ботов для Telegram с использованием Python и библиотеки python-telegram-bot.</p>
              <h4>Реализованные проекты:</h4>
              <ul>
                <li>Бот для управления задачами и напоминаниями</li>
                <li>Бот для работы с файлами и документами</li>
                <li>Информационный бот с интеграцией внешних API</li>
                <li>Бот для автоматизации рутинных задач</li>
              </ul>
              <h4>Функциональность:</h4>
              <ul>
                <li>Обработка текстовых команд</li>
                <li>Работа с файлами и медиа</li>
                <li>Интеграция с базами данных</li>
                <li>Клавиатуры и inline-кнопки</li>
                <li>Система уведомлений</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'web-modal' && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Веб-разработка</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Создание различных веб-сайтов и приложений с использованием современных технологий.</p>
              <h4>Выполненные проекты:</h4>
              <ul>
                <li>Персональные сайты-портфолио</li>
                <li>Лендинги для бизнеса</li>
                <li>Интерактивные веб-приложения</li>
                <li>Адаптивные интерфейсы</li>
              </ul>
              <h4>Технологии и навыки:</h4>
              <ul>
                <li>HTML5, CSS3, JavaScript (ES6+)</li>
                <li>React.js для создания интерактивных интерфейсов</li>
                <li>Адаптивная верстка и кроссбраузерность</li>
                <li>Работа с API и асинхронными запросами</li>
                <li>Оптимизация производительности</li>
                <li>Современные инструменты сборки (Vite, Webpack)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home