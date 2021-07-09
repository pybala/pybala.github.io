import * as React from "react"
import { Link } from "gatsby"
import AppTagCloud from './app-tag-cloud'
import AppCategoryCloud from './app-category-cloud'


const Header = ({ location, title, children }) => {
  let header = (
      <Link to="/"><h1 className="site-title">Technical Blog</h1></Link>
  )

  return (
    <header className="site-header">
        <div className="header-cont">
            <div className="header-logo">
                {header}
            </div>
            <div class="social-cont">
                <a href="//github.com/kumarbalap" className="bkSocialIcon bkGithub" title="GitHub" target="_blank" rel="noreferrer">&nbsp;</a>
                <span></span>
                <a href="//in.linkedin.com/in/kumarbalap" className="bkSocialIcon bkLinkedin" title="LinkedIn" target="_blank" rel="noreferrer">&nbsp;</a>
            </div>            
            <nav className="left-nav">
                <Link to="/">Home</Link>
                <AppTagCloud />
                <AppCategoryCloud />            
            </nav>
        </div>      
    </header>
  )
}

export default Header
