import { useEffect } from 'react'

export const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
          // Элемент появился в зоне видимости и еще не анимировался
          entry.target.classList.add('animate-in')
          // Отключаем наблюдение за этим элементом после анимации
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Функция для наблюдения за элементами
    const observeElements = () => {
      const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animate-in)')
      animateElements.forEach((el) => {
        if (!el.dataset.observed) {
          observer.observe(el)
          el.dataset.observed = 'true'
        }
      })
    }

    // Наблюдаем сразу
    observeElements()

    // Наблюдаем через задержки для динамически добавленных элементов
    const timeouts = [
      setTimeout(observeElements, 100),
      setTimeout(observeElements, 500),
      setTimeout(observeElements, 1000),
      setTimeout(observeElements, 2000)
    ]

    // Наблюдаем при изменении DOM
    const mutationObserver = new MutationObserver(() => {
      setTimeout(observeElements, 100)
    })
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      timeouts.forEach(clearTimeout)
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}