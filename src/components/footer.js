import * as React from "react"
import { Link } from "gatsby"

const Footer = () => {
  return (
    <footer className="bk-footer">
        &copy; {new Date().getFullYear()} <Link to="/">Balakumar</Link>
        <span className="footerLink">Built with <a href="https://www.gatsbyjs.com">Gatsby</a>, React</span>
    </footer>
  )
}

export default Footer
