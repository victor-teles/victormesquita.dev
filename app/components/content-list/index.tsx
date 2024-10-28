import FilterableList from "@components/filterable-list"
import getNotes from "@lib/get-notes"
import getPosts from "@lib/get-posts"
import { getTag, renderItem } from "./render-item"
import { Suspense } from "react"
import getReviews from "@lib/get-reviews"



export async function ContentListRSC() {
    const [posts, notes, reviews] = await Promise.all([
        getPosts(true),
        getNotes(),
        getReviews(),
    ])

    const content = [...posts, ...notes, ...reviews].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return <>
        <Suspense fallback={null}>
            <FilterableList
                items={content}
                renderItem={renderItem}
                tags={getTag}
                enableSearch={false}
                enableTags={true}
            />
        </Suspense>
    </>
}
