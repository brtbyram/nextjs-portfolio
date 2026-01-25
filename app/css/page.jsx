import React from 'react'
import style from './css.module.css'

function page() {
  return (
    <div className={style.body}>
        <div className={style.scene}>
            <div className={style.floor}></div>
            <div className={style.cube}>
                <div className={style.front}></div>
                <div className={style.back}></div>
                <div className={style.right}></div>
                <div className={style.left}></div>
                <div className={style.top}>
                    <div className={style.ballShadow}></div>
                </div>
                <div className={style.bottom}></div>
            </div>
            <div className={style.ball}>
                
            </div>
        </div>
    </div>
  )
}

export default page