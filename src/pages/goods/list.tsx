import type { NextPage } from 'next'
import styles from '../../styles/goods/GoodsList.module.scss'
import {
    Button,
    Card,
    Pane,
} from "evergreen-ui";
import React from "react";
import Head from "../../components/layouts/Head";
import Link from "next/link";

const List: NextPage = () => {
    return <div>
        <Head />
        <Pane display={"flex"} flexWrap={"wrap"} background={"#000000"} padding={52} minHeight={900}>
            <Card className={styles.card}>
                <Pane is={"img"} src={"/wish2.png"} width={255} height={255} />
                <div className={styles.goodName}>商品名称</div>
                <div className={styles.goodId}>商品id</div>
                <div className={styles.divider}></div>
                <Pane display="flex" justifyContent="space-between" alignItems={"center"}>
                    <div className={styles.goodInfo}>剩余认购份额: 23/60 </div>
                    <Link href={`/goods/1`} passHref>
                        <Button appearance={"primary"} >
                            GO
                        </Button>
                    </Link>
                </Pane>
            </Card>
        </Pane>
    </div>
}

export default List;
