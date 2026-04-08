import { AnimatedUnderline } from "@/src/components/ui/animated-underline"

const Demo = () => {
    return (
        <div className="p-8 flex flex-col gap-4 items-start">
            <AnimatedUnderline>
              <span className="text-primary font-bold text-2xl">Placement Calendar</span>
            </AnimatedUnderline>
            
            <AnimatedUnderline>
              <span className="text-white">Hover over this text</span>
            </AnimatedUnderline>
        </div>
    )
}

export { Demo }
