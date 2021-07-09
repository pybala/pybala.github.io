import { useStaticQuery, graphql } from 'gatsby';

export function CategoryList() {
    const data = useStaticQuery(graphql`
        query CategoryQuery {
            allMarkdownRemark(limit: 1000) {
                group(field: frontmatter___categories) {
                    value:fieldValue
                    count:totalCount
                }
            }
        }
    `);
  
    const categories = data.allMarkdownRemark.group
    return categories;
}
