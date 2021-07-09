import * as React from "react"
//import { Link } from "gatsby"
import Header from '../components/header'
import Footer from '../components/footer'



const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
        <Header />
        <main className="main-cont main-scrollable">
            <div class="content-inner">{children}</div>
        </main>
        <Footer />
        
        <div className="site-overlay"></div>
    </div>
  )
}

export default Layout
