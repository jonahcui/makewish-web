import React, {useState} from 'react'
import {Link as EvergreenLink, majorScale, Pane} from 'evergreen-ui'
import Link from 'next/link'
import {useRouter} from 'next/router'
import styles from './Head.module.scss'
import {useAppDispatch} from '../../app/hooks'
import Wallet from "./Wallet";
import PublishGood from "./PublishGood";

interface Props {}

const Head: React.FC<Props> = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { pathname } = router
    const parentPath = pathname.split('/')[1]

    return (
        <Pane
            is="nav"
            width="100%"
            position="sticky"
            top={0}
            backgroundColor="white"
            zIndex={10}
            height={majorScale(8)}
            flexShrink={0}
            display="flex"
            alignItems="center"
            borderBottom="muted"
            paddingX={majorScale(5)}
        >
            <Pane display="flex" alignItems="center" width={236}>
                <Link href="/">
                    <Pane width={100} height={24} cursor="pointer" className={styles.logo} >
                        <i>
                            MAKEWISH
                        </i>
                    </Pane>
                </Link>
            </Pane>
            <Pane flex={1}>

            </Pane>
            <Pane display="flex" justifyContent="flex-end" suppressHydrationWarning>
                <Link href="/goods/list" passHref>
                    <EvergreenLink color={parentPath !== 'goods' ? 'neutral' : undefined} marginRight={majorScale(3)}>
                        浏览商品
                    </EvergreenLink>
                </Link>
                <Link href="/foundations" passHref>
                    <EvergreenLink color={parentPath !== 'foundations' ? 'neutral' : undefined} marginRight={majorScale(3)}>
                        历史参与
                    </EvergreenLink>
                </Link>
                <Link href="/src/componentsents" passHref>
                    <EvergreenLink color={parentPath !== 'components' ? 'neutral' : undefined} marginRight={majorScale(3)}>
                        个人中心
                    </EvergreenLink>
                </Link>
                <Wallet />
                <PublishGood />
            </Pane>
        </Pane>
    )
}

export default Head
