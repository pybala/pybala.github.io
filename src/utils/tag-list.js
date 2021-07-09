import { useStaticQuery, graphql } from 'gatsby';

export function TagList() {
  const data = useStaticQuery(graphql`
      query TagsQuery {
          allMarkdownRemark(limit: 1000) {
              group(field: frontmatter___tags) {
                  value:fieldValue
                  count:totalCount
              }
          }
      }
  `);

  const tags = data.allMarkdownRemark.group
  return tags;
}
