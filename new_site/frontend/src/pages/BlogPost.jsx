import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/posts/${slug}`)
        setPost(response.data)
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Запись не найдена')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return (
      <div className="blog-container">
        <div className="container">
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <h1>{error}</h1>
            <Link to="/blog" style={{ color: 'var(--primary-color)' }}>
              ← Вернуться к блогу
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-container">
      <div className="container">
        <Link to="/blog" style={{ color: 'var(--primary-color)', marginBottom: '20px', display: 'inline-block' }}>
          ← Вернуться к блогу
        </Link>
        
        <article className="blog-post" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {post.cover_image && (
            <img 
              src={post.cover_image} 
              alt={post.title}
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                marginBottom: '30px'
              }}
            />
          )}
          
          <h1 style={{ 
            color: '#fff', 
            fontSize: '2.5rem', 
            marginBottom: '20px',
            textShadow: '0 0 10px var(--neon-glow)'
          }}>
            <div dangerouslySetInnerHTML={{ __html: post.title }} />
          </h1>
          
          {post.published_at && (
            <div className="date" style={{ marginBottom: '30px' }}>
              {new Date(post.published_at).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
          
          <div 
            className="content"
            style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8',
              color: 'var(--text-color)'
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  )
}

export default BlogPost