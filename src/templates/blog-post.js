import * as React from "react"
import { css } from "@emotion/react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        css={style.markdownWrapper}
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`

const style = {
  markdownWrapper: css`
    & {
      footer {
        padding: var(--spacing-6) var(--spacing-0);
      }

      hr {
        background: var(--color-accent);
        height: 1px;
        border: 0;
      }

      /* Heading */

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: var(--font-heading);
        margin-top: var(--spacing-12);
        margin-bottom: var(--spacing-6);
        line-height: var(--lineHeight-tight);
        letter-spacing: -0.025em;
      }

      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: var(--fontWeight-bold);
        color: var(--color-heading);
      }

      h1 {
        font-weight: var(--fontWeight-black);
        font-size: var(--fontSize-6);
        color: var(--color-heading-black);
      }

      h2 {
        font-size: var(--fontSize-5);
      }

      h3 {
        font-size: var(--fontSize-4);
      }

      h4 {
        font-size: var(--fontSize-3);
      }

      h5 {
        font-size: var(--fontSize-2);
      }

      h6 {
        font-size: var(--fontSize-1);
      }

      h1 > a {
        color: inherit;
        text-decoration: none;
      }

      h2 > a,
      h3 > a,
      h4 > a,
      h5 > a,
      h6 > a {
        text-decoration: none;
        color: inherit;
      }

      /* Prose */

      p {
        line-height: var(--lineHeight-relaxed);
        --baseline-multiplier: 0.179;
        --x-height-multiplier: 0.35;
        margin: var(--spacing-0) var(--spacing-0) var(--spacing-8)
          var(--spacing-0);
        padding: var(--spacing-0);
      }

      ul,
      ol {
        margin-left: var(--spacing-0);
        margin-right: var(--spacing-0);
        padding: var(--spacing-0);
        margin-bottom: var(--spacing-8);
        list-style-position: outside;
        list-style-image: none;
      }

      ul li,
      ol li {
        padding-left: var(--spacing-0);
        margin-bottom: calc(var(--spacing-8) / 2);
      }

      li > p {
        margin-bottom: calc(var(--spacing-8) / 2);
      }

      li *:last-child {
        margin-bottom: var(--spacing-0);
      }

      li > ul {
        margin-left: var(--spacing-8);
        margin-top: calc(var(--spacing-8) / 2);
      }

      blockquote {
        color: var(--color-text-light);
        margin-left: calc(-1 * var(--spacing-6));
        margin-right: var(--spacing-8);
        padding: var(--spacing-0) var(--spacing-0) var(--spacing-0)
          var(--spacing-6);
        border-left: var(--spacing-1) solid var(--color-primary);
        font-size: var(--fontSize-2);
        font-style: italic;
        margin-bottom: var(--spacing-8);
      }

      blockquote > :last-child {
        margin-bottom: var(--spacing-0);
      }

      blockquote > ul,
      blockquote > ol {
        list-style-position: inside;
      }

      table {
        width: 100%;
        margin-bottom: var(--spacing-8);
        border-collapse: collapse;
        border-spacing: 0.25rem;
      }

      table thead tr th {
        border-bottom: 1px solid var(--color-accent);
      }

      /* Link */

      a {
        color: var(--color-primary);
      }

      a:hover,
      a:focus {
        text-decoration: none;
      }

      /* Media queries */

      @media (max-width: 42rem) {
        blockquote {
          padding: var(--spacing-0) var(--spacing-0) var(--spacing-0)
            var(--spacing-4);
          margin-left: var(--spacing-0);
        }
        ul,
        ol {
          list-style-position: inside;
        }
      }
    }
  `,
}
