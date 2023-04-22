import { useStaticQuery, graphql } from 'gatsby';

export function TagList() {
  const data = useStaticQuery(graphql`
      query TagsQuery {
          allMarkdownRemark(limit: 1000) {
              group(field: {frontmatter: {tags: SELECT}}) {
                  value:fieldValue
                  count:totalCount
              }
          }
      }
  `);

  const tags = data.allMarkdownRemark.group
  return tags;
}
