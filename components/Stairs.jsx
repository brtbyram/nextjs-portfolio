import { motion} from 'framer-motion'

function Stairs() {
  
    const reverseIndex = (index) => {
        const totalSteps = 6 // 6 tane basamak var
        return totalSteps - index - 1 // 6 - 0 - 1 = 5
    }

  return (
    <>
    {[...Array(6)].map((_, index) => (
        <motion.div
            key={index}
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            exit={{ top: ["100%", "0%"] }}
            transition={{
                duration: 0.4,
                delay: reverseIndex(index) * 0.1,
                ease: "easeInOut",
            }}
            className="h-full w-full bg-white relative"
        />
    ))}
    </>
  )
}

export default Stairs