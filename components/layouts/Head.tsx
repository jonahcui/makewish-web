import React from 'react'
import { Pane, majorScale, Link as EvergreenLink } from 'evergreen-ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {inspect} from "util";
import styles from './Head.module.scss'

interface Props {}

const Head: React.FC<Props> = () => {
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
                <Link href="/pages">
                    <Pane width={100} height={24} cursor="pointer" className={styles.logo} >
                        <i>
                            MAKEWISH
                        </i>
                    </Pane>
                </Link>
            </Pane>
            <Pane flex={1}>

            </Pane>
            <Pane display="flex" justifyContent="flex-end">
                <Link href="/introduction/getting-started" passHref>
                    <EvergreenLink color={parentPath !== 'introduction' ? 'neutral' : undefined} marginRight={majorScale(3)}>
                        浏览商品
                    </EvergreenLink>
                </Link>
                <Link href="/foundations" passHref>
                    <EvergreenLink color={parentPath !== 'foundations' ? 'neutral' : undefined} marginRight={majorScale(3)}>
                        历史参与
                    </EvergreenLink>
                </Link>
                <Link href="/components" passHref>
                    <EvergreenLink color={parentPath !== 'components' ? 'neutral' : undefined} marginRight={majorScale(3)}>
                        个人中心
                    </EvergreenLink>
                </Link>
                <Link href="/patterns" passHref style={{width: 150}}>
                    <EvergreenLink color={parentPath !== 'patterns' ? 'neutral' : undefined} marginRight={majorScale(3)}>
                        链接钱包
                    </EvergreenLink>
                </Link>
            </Pane>
        </Pane>
    )
}

export default Head
