import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"

export const PostCard = ({ frontmatter, fields, excerpt }) => {
  const title = frontmatter.title || fields.slug
  const thumbnail = getImage(frontmatter.thumbnail)

  return (
    <li>
      <article
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h2>
            <Link to={fields.slug} itemProp="url">
              <span itemProp="headline">{title}</span>
            </Link>
          </h2>
          <div style={{ width: "200px" }}>
            <GatsbyImage image={thumbnail} alt="thumbnail" />
          </div>
          <small>{frontmatter.date}</small>
        </header>
        <section>
          <p
            dangerouslySetInnerHTML={{
              __html: frontmatter.description || excerpt,
            }}
            itemProp="description"
          />
        </section>
      </article>
    </li>
  )
}
