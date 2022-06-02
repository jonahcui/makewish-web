import type {NextPage} from 'next'
import {Pane,} from "evergreen-ui";
import React, {useEffect, useState} from "react";
import GoodCard from "../../components/GoodCard";
import wallet from "../../components/layouts/Wallet";
import {getGoodInfos, GoodInfo} from "../../feature/goods/goodsAPI";

const List: NextPage = () => {
    const [goods, setGoods] = useState<Array<GoodInfo>>([]);

    const loadGoods = async () => {
        if (typeof window === 'undefined') {
            return
        }
        const goods = await getGoodInfos();
        setGoods(goods);
    }

    useEffect(() => {
        loadGoods()
    }, [wallet]);

    if (typeof window === 'undefined') {
        return <div />
    }

    const _renderGoods = () => {
        if (!goods || goods.length === 0) {
            return []
        }
        return goods.map(good => (<GoodCard  key={good.goodId} good={good} />))
    }

    return <main style={{minHeight: "100vh", background:"#000000"}}>
        <Pane display={"flex"} flexWrap={"wrap"} padding={52} >
            {
                _renderGoods()
            }
        </Pane>
    </main>
}

export default List;
