import { cache } from 'react'
import { readFiles } from './read-files'
import {  Review } from './types'

export const getReviews = cache(async () => {
  const reviewsWithMetadata = readFiles<Review>('./reviews/')

  const filtered = reviewsWithMetadata
    .filter((review) => review !== null)
    .sort((a, b) =>
      a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0,
    ).map((review) => {
      return {
        ...review,
        type: 'review'
      }
    })

  return filtered as Review[]
})

export async function getReview(slug: string) {
  const reviews = await getReviews()
  return reviews.find((review) => review.slug === slug)
}

export default getReviews
