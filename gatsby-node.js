const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require("lodash")


exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const tagTemplate = path.resolve(`./src/templates/tags.js`)
  const categoryTemplate = path.resolve(`./src/templates/categories.js`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    ` 
      {
        postsRemark: allMarkdownRemark(
            sort: {frontmatter: {date: ASC}}
            limit: 1000
          ) {
            nodes {
              id
              fields {
                slug
              }
            }
        }
        tagsGroup: allMarkdownRemark(limit: 2000) {
          group(field: {frontmatter: {tags: SELECT}}) {
            fieldValue
          }
        }
        categoriesGroup: allMarkdownRemark(limit: 2000) {
          group(field: {frontmatter: {categories: SELECT}}) {
            fieldValue
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.postsRemark.nodes;

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
      posts.forEach((post, index) => {
          const previousPostId = index === 0 ? null : posts[index - 1].id
          const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

          createPage({
              path: post.fields.slug,
              component: blogPost,
              context: {
                  id: post.id,
                  previousPostId,
                  nextPostId,
              },
          })
      })
  }

  // Extract tag data from query
  const tags = result.data.tagsGroup.group
  // Make tag pages
  tags.forEach(tag => {
      createPage({
          path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
          component: tagTemplate,
          context: {
              tag: tag.fieldValue,
          },
      })
  })

  // Extract tag data from query
  const categories = result.data.categoriesGroup.group
  // Make tag pages
  categories.forEach(category => {
      createPage({
          path: `/categories/${_.kebabCase(category.fieldValue)}/`,
          component: categoryTemplate,
          context: {
            category: category.fieldValue,
          },
      })
  })  
}

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions

    if (node.internal.type === `MarkdownRemark`) {
        //const value = createFilePath({ node, getNode })
        const value = createFilePath({ node, getNode }).replace(/\d{4}-\d{2}-\d{2}--?/, '');

        createNodeField({
            name: `slug`,
            node,
            value,
        })
    }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
