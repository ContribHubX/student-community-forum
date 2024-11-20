import { MainLayout } from "@/components/layouts/layout"
import { CommunityCard } from "./to-be-extracted-in-a-feature-comp/community-card"
import { communities } from "@/features/shared/data/communities"

const words = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";

export const CommunitiesRoute = () => {
  return (
    <MainLayout>
        <section className="text-primary-foreground">
            <h1 className="font-semibold text-lg text-center">Explore More</h1>
            
            <div className="sm:ml-14 my-6  md:text-left">
                <h2 className="font-semibold">Top Communities</h2>
                <p className="text-muted-foreground text-xs">Browse More Communities</p>
            </div>
            <div className={`grid gap-y-4 gap-x-0 justify-items-center mx-auto
                            grid-cols-1
                            sm:grid-cols-2
                            md:grid-cols-3
                            lg:max-w-[90%]  
                            lg:grid-cols-4  
                            xl:max-w-[85%]  
                            2xl:max-w-[90%] 
                            2xl:grid-cols-5`}>
                {words.split("").map((val, index) => (
                    <CommunityCard
                        key={index}
                        community={communities[0]}
                        rank={index + 1}
                    />
                ))}
            </div>
        </section>
    </MainLayout>
  )
}
