import React from 'react';
import {Pane, Table} from "evergreen-ui";
import styles from "../styles/Home.module.scss";


const JoinRecordTable = () => {
    return <Pane marginBottom={135} width={1200}>
        <div className={styles.rankTableTitle}>幸运排行榜</div>
        <Table.Body className={styles.rankTable}>
            <Table.Head className={styles.rankTableHead}>
                <Table.TextCell className={styles.headCell}>
                    昵称
                </Table.TextCell>
                <Table.TextCell className={styles.headCell}>认购份额</Table.TextCell>
                <Table.TextCell className={styles.headCell}>账户地址</Table.TextCell>
                <Table.TextCell className={styles.headCell}>认购时间</Table.TextCell>
                <Table.TextCell className={styles.headCell}>认购金额</Table.TextCell>
            </Table.Head>
            <Table.Body>
                <Table.Row className={styles.rankTableHead}>
                    <Table.TextCell className={styles.headCell}>
                        Fixed width
                    </Table.TextCell>
                    <Table.TextCell className={styles.headCell}>Flex me col 2</Table.TextCell>
                    <Table.TextCell className={styles.headCell}>Flex me col 3</Table.TextCell>
                    <Table.TextCell className={styles.headCell}>Flex me col 3</Table.TextCell>
                    <Table.TextCell className={styles.headCell}>Flex me col 3</Table.TextCell>
                </Table.Row>
            </Table.Body>
        </Table.Body>
    </Pane>
}

export default JoinRecordTable;
