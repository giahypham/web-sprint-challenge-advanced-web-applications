import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate('/');
  }
  const redirectToArticles = () => {
    navigate('/articles');
   }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().post('/login', { username, password })
      .then(resp => {
        localStorage.setItem('token', resp.data.token);
        setMessage(resp.data.message);
        redirectToArticles();
        setSpinnerOn(false)
      })
      .catch(err => {
        console.error(err);
        setSpinnerOn(false);
      })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().get('/articles')
    .then(resp => {
      setArticles(resp.data.articles);
      setMessage(resp.data.message);
      setSpinnerOn(false);
    })
    .catch(err => {
      console.error(err)
      navigate('/');
      setSpinnerOn(false)
    })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().post('/articles', article)
    .then(resp => {
      setArticles([...articles, resp.data.article]);
      setMessage(resp.data.message);
      setSpinnerOn(false)
    })
    .catch(err => {
      console.error(err)
      navigate('/');
      setSpinnerOn(false)
    })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage('');
    setSpinnerOn(true)
    axiosWithAuth().put(`/articles/${article_id}`, article)
      .then(resp => {
        setArticles((prevArticles) => {
          return prevArticles.map(art => 
            art.article_id === article_id ? resp.data.article : art
          )
        });
        setMessage(resp.data.message);
        setSpinnerOn(false)
      })
      .catch(err => {
        console.error(err);
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().delete(`/articles/${article_id}`)
    .then(resp => {
      setArticles(articles.filter(article => (article.article_id !== article_id)))
      setMessage(resp.data.message);
      setSpinnerOn(false)
    })
    .catch(err => {
      console.error(err);
      setSpinnerOn(false)
    })
  }

  const currentArticle = articles ? articles.find(article => article.article_id === currentArticleId) : null;

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle} 
                updateArticle={updateArticle}
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={currentArticle}
              />
              <Articles 
                articles={articles} 
                getArticles={getArticles} 
                updateArticle={updateArticle} 
                deleteArticle={deleteArticle}
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
