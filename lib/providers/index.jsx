import Cursor from "@/app/resume/Cursor";
import AnimationProvider from "./AnimationProvider";
import LenisProvider from "./LenisProvider";
import { CursorProvider } from "../../lib/context/CursorContext";

function Providers({ children }) {
    return (

        <LenisProvider>
            <CursorProvider>
                <Cursor />
                {children}
            </CursorProvider>
        </LenisProvider>
    )
}

export default Providers;