import React from "react"
import { css } from "@emotion/react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"

export const PostCard = ({ frontmatter, fields, excerpt }) => {
  const title = frontmatter.title || fields.slug
  const thumbnail = getImage(frontmatter.thumbnail)
  const { tags } = frontmatter

  return (
    <li>
      <article
        css={style.article}
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
      >
        <section css={style.thumbnailWrapper}>
          <GatsbyImage image={thumbnail} alt="thumbnail" />
        </section>
        <section>
          <header>
            <div>
              <p>
                {tags.map(tag => (
                  <span key={tag} css={style.tagStyle}>
                    #{tag}
                  </span>
                ))}
              </p>
            </div>
            <h2 css={style.title}>
              <Link to={fields.slug} itemProp="url">
                <span itemProp="headline">{title}</span>
              </Link>
            </h2>
          </header>
          <section>
            <p
              dangerouslySetInnerHTML={{
                __html: frontmatter.description || excerpt,
              }}
              css={style.description}
              itemProp="description"
            />
            <small>{frontmatter.date}</small>
          </section>
        </section>
      </article>
    </li>
  )
}

const style = {
  article: css`
    @media (min-width: 1280px) {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      max-width: 1280px;
      padding: 20px;
    }
  `,

  title: css`
    font-size: 21px;
    font-weight: 700;
    margin-top: 15px;
    margin-bottom: 12px;
  `,

  description: css`
    font-size: 14px;
  `,

  thumbnailWrapper: css`
    width: 170px;
  `,

  tagStyle: css`
    color: rgb(0, 198, 142);
    margin-right: 25px;
  `,
}
