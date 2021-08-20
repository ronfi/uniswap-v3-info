import React, { useEffect, useMemo } from 'react'
import { PageWrapper } from 'pages/styled'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed, AutoRow } from 'components/Row'
import { ButtonPrimary, ButtonGray, SavedIcon } from 'components/Button'
import { ExternalLink, Download } from 'react-feather'
import { TYPE } from 'theme'
import PoolTable from 'components/pools/PoolTable'
import { useAllPoolData, usePoolDatas } from 'state/pools/hooks'
import { notEmpty } from 'utils'
import { useSavedPools } from 'state/user/hooks'
import { DarkGreyCard } from 'components/Card'
import { sprintf } from 'sprintf-js'
// import TopPoolMovers from 'components/pools/TopPoolMovers'

function ExportTxToFile(poolDatas: any) {
  console.log(poolDatas)
  let totalData = 'data:text/csv;charset=utf-8,'
  totalData += ' token0, token1, fee, tvlUSD, volUSD' + '\n'

  if (poolDatas) {
    for (const poolData of poolDatas) {
      const token0 = poolData.token0.symbol
      const token1 = poolData.token1.symbol
      const fee = poolData.feeTier
      const tvlUSD = poolData.tvlUSD
      const volUSD = poolData.volumeUSD
      const txStr = sprintf('%s, %s, %s, %s, %s\n', token0, token1, fee, tvlUSD, volUSD)
      totalData += txStr
    }
  }

  const encodedUri = encodeURI(totalData)
  window.open(encodedUri)
}

export default function PoolPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((p) => p.data)
      .filter(notEmpty)
  }, [allPoolData])

  // console.log(allPoolData)

  const [savedPools] = useSavedPools()
  const watchlistPools = usePoolDatas(savedPools)

  return (
    <PageWrapper>
      <AutoColumn gap="lg">
        <TYPE.main>Your Watchlist</TYPE.main>
        {watchlistPools.length > 0 ? (
          <PoolTable poolDatas={watchlistPools} />
        ) : (
          <DarkGreyCard>
            <TYPE.main>Saved pools will appear here</TYPE.main>
          </DarkGreyCard>
        )}
        {/* <HideSmall>
          <DarkGreyCard style={{ paddingTop: '12px' }}>
            <AutoColumn gap="md">
              <TYPE.mediumHeader fontSize="16px">Trending by 24H Volume</TYPE.mediumHeader>
              <TopPoolMovers />
            </AutoColumn>
          </DarkGreyCard>
        </HideSmall> */}
        <TYPE.main>All Pools</TYPE.main>
        <PoolTable poolDatas={poolDatas} />
      </AutoColumn>
      <AutoColumn gap="lg">
        <RowFixed mr="20px" gap="10px" align="center" justify="center">
          <ButtonPrimary width="100px" style={{ height: '44px' }} onClick={() => ExportTxToFile(poolDatas)}>
            <RowBetween>
              <Download size={24} />
              <div style={{ display: 'flex', alignItems: 'center' }}>Export</div>
            </RowBetween>
          </ButtonPrimary>
        </RowFixed>
      </AutoColumn>
    </PageWrapper>
  )
}
