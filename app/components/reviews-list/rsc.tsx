import getReviews from '@lib/get-reviews'
import ReviewsList from '.'

export async function ReviewsListRSC({ paginate }: { paginate?: boolean }) {
  const reviews = await getReviews()
  return <ReviewsList reviews={reviews} paginate={paginate} />
}
