import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const CategoriesTemplate = ({ pageContext, data, location }) => {
  const { category } = pageContext;
  const posts = data.allMarkdownRemark.edges
  const totalCount = data.allMarkdownRemark.totalCount
  const siteTitle = ''

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={siteTitle}
        description={siteTitle}
      />
      <article className="tags-main">
        <header>
          <h1 itemProp="headline">Categories: <span>{category}</span></h1>
        </header>

        <ol style={{ marginLeft: `0`, listStyle: `none` }}>
        {posts.map(post => {
            const title = post.node.frontmatter.title || post.node.fields.slug

            return (
              <li key={post.node.fields.slug}>
                <article className="post-list-item">
                    <h2>
                      <Link to={post.node.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.node.frontmatter.date}</small>
                </article>
              </li>
            )
        })}
        </ol>        
      </article> 
    </Layout>
  )
}

export const pageQuery = graphql`
  query($category: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { categories: { in: [$category] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`

export default CategoriesTemplate;