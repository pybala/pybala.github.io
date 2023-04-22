import { useStaticQuery, graphql } from 'gatsby';

export function CategoryList() {
    const data = useStaticQuery(graphql`
        query CategoryQuery {
            allMarkdownRemark(limit: 1000) {
                group(field: {frontmatter: {categories: SELECT}}) {
                    value:fieldValue
                    count:totalCount
                }
            }
        }
    `);
  
    const categories = data.allMarkdownRemark.group
    return categories;
}
