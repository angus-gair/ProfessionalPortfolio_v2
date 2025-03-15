select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode` limit 100;
CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode` AS (
  WITH preferred_store_postcode AS (
    SELECT 
      *,
      ROW_NUMBER() OVER (PARTITION BY crn ORDER BY cnts DESC NULLS LAST) AS row_num
    FROM (
      SELECT 
        COUNT(DISTINCT bas.basket_key) AS cnts,
        bas.crn,
        bas.division_nbr,
        bas.store_nbr
      FROM `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.bi_article_sales` bas
      WHERE bas.division_nbr IN (1005, 1030)
        AND bas.store_nbr != -100
        AND LENGTH(bas.crn) > 3 
      GROUP BY bas.crn, bas.division_nbr, bas.store_nbr
      UNION ALL
      SELECT 
        COUNT(DISTINCT bas.basket_key) AS cnts,
        bas.crn,
        bas.division_nbr,
        bas.store_nbr
      FROM `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.bi_article_sales_bigw` bas
      WHERE bas.division_nbr IN (1005, 1030)
        AND bas.store_nbr != -100
        AND LENGTH(bas.crn) > 3
      GROUP BY bas.crn, bas.division_nbr, bas.store_nbr
      UNION ALL 
      SELECT 
        COUNT(DISTINCT bas.basket_key) AS cnts,
        bas.crn,
        bas.division_nbr,
        bas.store_nbr
      FROM `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.bi_article_sales_bws` bas
      WHERE LENGTH(bas.crn) > 3
        AND bas.division_nbr IN (1005, 1030)
        AND bas.store_nbr != -100
      GROUP BY bas.crn, bas.division_nbr, bas.store_nbr
    )
    QUALIFY ROW_NUMBER() OVER (PARTITION BY crn ORDER BY cnts DESC NULLS LAST) = 1
  ),

  member_postcodes_resi AS (
    SELECT 
      crn, 
      f01_mem_resi_address_postcode AS post_code, 
      COUNT(f01_mem_resi_address_postcode) AS count,
      LENGTH(f01_mem_resi_address_postcode) AS len_postcode,
      ROW_NUMBER() OVER (PARTITION BY crn ORDER BY COUNT(f01_mem_resi_address_postcode) DESC NULLS LAST) AS rn
    FROM `gcp-wow-rwds-ai-features-prod.cmd3.b01_01_membership`
    WHERE LENGTH(f01_mem_resi_address_postcode) > 2
      AND f01_mem_res_add_postcode_flag = 'Y'
      AND f01_mem_resi_address_postcode NOT IN ('0', '0000')
    GROUP BY crn, f01_mem_resi_address_postcode
  ),

  member_postcodes_mail AS (
    SELECT 
      crn, 
      f01_mem_mail_address_postcode AS post_code, 
      COUNT(f01_mem_mail_address_postcode) AS count,
      LENGTH(f01_mem_mail_address_postcode) AS len_postcode,
      ROW_NUMBER() OVER (PARTITION BY crn ORDER BY COUNT(f01_mem_mail_address_postcode) DESC NULLS LAST) AS rn
    FROM `gcp-wow-rwds-ai-features-prod.cmd3.b01_01_membership`
    WHERE LENGTH(f01_mem_mail_address_postcode) > 2
      AND f01_mem_mail_add_postcode_flag = 'Y'
      AND f01_mem_mail_address_postcode NOT IN ('0', '0000')
    GROUP BY crn, f01_mem_mail_address_postcode
  ),

  member_postcodes AS (
    SELECT crn, post_code FROM member_postcodes_resi
    UNION ALL
    SELECT crn, post_code FROM member_postcodes_mail WHERE crn NOT IN (SELECT crn FROM member_postcodes_resi)
  ),

  edr_universe AS (
    SELECT DISTINCT
      crn,
      preferred_store
    FROM `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.edr_crn_flags_v` ecf
    WHERE fw_end_date = '2024-11-03'
  ),

  final_postcodes AS (
    SELECT 
      eu.crn,
      COALESCE(mp.post_code, CAST(psp.store_nbr AS STRING), CAST(eu.preferred_store AS STRING)) AS postcode,
      ROW_NUMBER() OVER (PARTITION BY eu.crn ORDER BY eu.crn) AS row_num
    FROM edr_universe eu
    LEFT JOIN preferred_store_postcode psp 
      ON eu.crn = psp.crn
    LEFT JOIN member_postcodes mp
      ON eu.crn = mp.crn
  )

  SELECT crn, postcode
  FROM final_postcodes
  WHERE row_num = 1
);

select * from `gcp-wow-rwds-ai-pobe-dev.angus.finance_fw_cost_bigw`    limit 100
/*----------------------------------------------------------------------------------------------------------*/
/*                                Section 1: Base-Earn                                                      */
/*  cost @ 50bps                                                                                               */
/*----------------------------------------------------------------------------------------------------------*/

create or replace table `gcp-wow-rwds-ai-pobe-dev.angus.mmm_1_base`    as (
with points as (
SELECT 

'BaseEarn' AS campaign_name,
'Points' AS Metric,
'finance_fw_cost_bigw' AS Source,
'Points'  AS Metric_Name,
offer_type,
BigWFiscalWeekStartDate,
start_txn_date,
IFNULL(Business_Destination, 'all_store') as Business_Destination,
crn, 
offer_nbr,
Points_cost_excl_gst_sales*400 AS Metric_value,
FROM  `gcp-wow-rwds-ai-pobe-dev.angus.finance_fw_cost_bigw`   
WHERE 1=1
AND Offer_Type = 'Base-Earn'
)
, cost as (
SELECT 

'BaseEarn' AS campaign_name,
'Cost' AS Metric,
'finance_fw_cost_bigw' AS Source,
'Cost'  AS Metric_Name,
offer_type,
BigWFiscalWeekStartDate,
start_txn_date,
IFNULL(Business_Destination, 'all_store') as Business_Destination,
crn, 
offer_nbr,
Points_cost_excl_gst_sales AS Metric_value,
FROM  `gcp-wow-rwds-ai-pobe-dev.angus.finance_fw_cost_bigw`   
WHERE 1=1
AND Offer_Type = 'Base-Earn'
)


-- select sum(Metric_value) from cost

, merged_stg as (
select * from points
union all
select * from cost
) 

, merged as (
select distinct * from merged_stg
)

, tv as (
Select 
Business_Destination,
CONCAT('rdws_', a.campaign_name, '_', Metric) AS variable,
IFNULL(tv.MarketType, 'National') as MarketType,
IFNULL(tv.AggTvMarket, 'National') as AggTvMarket,
IFNULL(tv.Region, 'National') as Region,
BigWFiscalWeekStartDate,
SUM(Metric_value) /*0.95*/ AS Metric_value
FROM merged a
LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode` pc
ON a.crn = pc.crn
  LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_tv_markets_postcodes` tv
    ON pc.Postcode = tv.Postcode
GROUP BY 1,2,3,4,5,6
) 

-- SELECT distinct variable FROM tv

, pivot_table AS (
  SELECT * FROM tv
  PIVOT (
    SUM( Metric_value) FOR variable IN (
      'rdws_BaseEarn_Cost',
      'rdws_BaseEarn_Points'
    )
  )
)

SELECT * FROM pivot_table
order by 1,2,3,4,5


);

/*******************************             testing              ******************************/
SELECT 
  postcode,
  COUNT(*) AS count
FROM 
  `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode`
GROUP BY 
  postcode
HAVING 
  COUNT(*) > 1
ORDER BY 
  count DESC;


select dd.FiscalYear,  sum(rdws_BaseEarn_Cost) 
from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_1_base` a
  INNER JOIN 
      `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd
      ON a.BigWFiscalWeekStartDate = dd.CalendarDay 
GROUP BY 1
/*  
2023: 1,4641,713
2024: 15,359,939 | 14,472,839
2025: 5,010,085
*/


-- 15,359,939
-- 37,758,373
-- 14,566,250

select 4542700/4645731.642
select 14566250/14472839
`gcp-wow-rwds-ai-pobe-dev.angus.mmm_tv_markets_postcodes` 

/*----------------------------------------------------------------------------------------------------------*/
/*                                Section 2: EVERYDAY EXTRA                                                      */
/*----------------------------------------------------------------------------------------------------------*/
-- Creating or replacing the table `mmm_bigw_bas`
CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.mmm_bigw_bas` AS (

WITH base_sales AS (
  SELECT 
      srd.CRN,
      bd.Business AS Business_Destination,
      srd.basket_key,
      SUM(srd.tot_amt_incld_gst) AS sales
  FROM 
     `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.bi_article_sales_bigw` srd
  INNER JOIN 
      `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd
      ON srd.start_txn_date = dd.CalendarDay
  LEFT JOIN 
      `gcp-wow-rwds-ai-data-prod.outbound.BigW_Destination_Business` bd
      ON bd.SubCategory = INITCAP(srd.category)
  WHERE 
      srd.crn NOT IN ('-1', '-2', '0', '000')
      AND srd.category <> 'Gift Cards'
      AND srd.tot_amt_incld_gst > 0
      AND srd.division_nbr = 1060
  GROUP BY 
      srd.CRN, bd.Business, srd.basket_key
),

t2 AS (
  SELECT 
      CRN,
      Business_Destination,
      sales AS sales_dollar,
      basket_key, 
      SUM(sales) OVER (PARTITION BY CRN, basket_key) AS total_sales,
      SAFE_DIVIDE(sales, SUM(sales) OVER (PARTITION BY CRN, basket_key)) AS sales_ratio
  FROM 
      base_sales
)

SELECT 
    CRN, 
    basket_key, 
    Business_Destination,
    sales_ratio AS sales,
    total_sales,
    sales_dollar
FROM 
    t2
);

-- Creating or replacing the table `mmm_joined`
select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_joined` 
where orderid = '364621682'
limit 100;



CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.mmm_joined` AS (

WITH t1 AS (
  SELECT  
      a.BasketKey, 
      a.OrderID
  FROM  
      `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_integrated_sales_view.basket_sales_summary_v` a
  WHERE 
      SalesOrg = 1060
  AND Orderid is not null

  UNION ALL 

  SELECT  
      a.BasketKey, 
      a.BasketKey AS OrderID
  FROM  
      `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_integrated_sales_view.basket_sales_summary_v` a
  WHERE 
      SalesOrg = 1060

union all

  SELECT  
      a.BasketKey, 
      CONCAT('AUBW',OrderID) AS OrderID
  FROM  
      `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_integrated_sales_view.basket_sales_summary_v` a
  WHERE 
      SalesOrg = 1060
  AND Orderid is not null
    -- and a.OrderID like '%364621682%'


)

SELECT * 
FROM t1
);



-- Creating or replacing the table `mmm_2_edx`
CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.mmm_2_edx_stg` AS (

WITH new_data AS (
  SELECT 
      FiscalWeekStartDate,
      crn, 
      channel,
      orderid AS og,
      orderid,
    --   COALESCE(extra10_OYS, 0)  as extra10_OYS,
      (COALESCE(extra10_OYS, 0) - (COALESCE(extra10_OYS, 0) * 0.1093244534)) AS extra10_OYS,
      (COALESCE(additional, 0) - (COALESCE(additional, 0) * 0.1093244534)) AS additional
    --   COALESCE(additional, 0) AS additional
  FROM (
      SELECT 
          FiscalWeekStartDate,
          crn,
          orderid,
          channel,
          CASE 
              WHEN benefit = '10%' THEN 'extra10_OYS'
              WHEN benefit LIKE '%x' THEN 'additional'
              ELSE benefit 
          END AS offer_type,
          reward_value
      FROM 
          `gcp-wow-rwds-ai-subs-prod.EDX.EDX_offer_details`
      WHERE 
          banner IN ('BigW', 'Big W')
          AND LoyaltyCustomerTypeDescription IN ('Customer')
  ) AS source_table
  PIVOT (
      SUM(reward_value)
      FOR offer_type IN ('extra10_OYS', 'additional')
  )
)

-- select * from new_data limit 100;

, final AS (
  SELECT 
      nd.FiscalWeekStartDate,
      nd.crn, 
      nd.channel,
      nd.og,
      nd.orderid, 
      nd.extra10_OYS as rdws_paidSubsEdx_10percDisc_cost,
      nd.additional as rdws_paidSubsEdx_addPoints_points,
      bas.sales_dollar,
      bas.Basket_Key as bas,
      Business_Destination,
      sales
  FROM 
      new_data nd
   left JOIN 
      `gcp-wow-rwds-ai-pobe-dev.angus.mmm_joined` j
      ON nd.orderid = j.OrderID
   left JOIN 
      `gcp-wow-rwds-ai-pobe-dev.angus.mmm_bigw_bas` bas
      ON j.BasketKey = bas.basket_key

)

SELECT * 
FROM final
);




create or replace table `gcp-wow-rwds-ai-pobe-dev.angus.mmm_2_base`    as (
WITH ranked_data AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY og, Business_Destination ORDER BY FiscalWeekStartDate DESC) AS rn
    FROM 
        `gcp-wow-rwds-ai-pobe-dev.angus.mmm_2_edx_stg`
)
, final as (
SELECT 
    FiscalWeekStartDate,
    crn, 
    channel,
    og,
    orderid, 
    Business_Destination, 
     extra10_OYS,
    sales*extra10_OYS AS MetricValue,
    sales*extra10_OYS*400 AS MetricValue3,
    sales*additional AS Metric2,
    '10percDisc' as MetricName,
    'additnlPoints' as MetricName2,
FROM ranked_data
WHERE rn = 1
) 

select 
a.crn,
a.FiscalWeekStartDate,
IFNULL(a.Business_Destination, 'all_store') as Business_Destination,
-- CONCAT('rdws_', 'paidSubsEdx', '_', MetricName) AS variable,
IFNULL(tv.MarketType, 'National') as MarketType,
IFNULL(tv.AggTvMarket, 'National') as AggTvMarket,
IFNULL(tv.Region, 'National') as Region,
SUM(MetricValue)  AS rdws_paidSubsEdx_10percDisc_cost,
SUM(Metric2)      AS rdws_paidSubsEdx_addPoints_cost,
SUM(MetricValue3) AS rdws_paidSubsEdx_addPoints_points

FROM final a
LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode` pc
ON a.crn = pc.crn
  LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_tv_markets_postcodes` tv
    ON pc.Postcode = tv.Postcode
-- where a.crn = '33300000000001647752'
GROUP BY 1,2,3,4,5,6
order by 1 desc
)

/*----------------------------------------------------------------------------------------------------------*/
/*                                Section 2: SUBSCRIBERS                                          */
/*----------------------------------------------------------------------------------------------------------*/

CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.mmm_monthly_new_subscribers` AS (
  WITH dim_date AS (
  SELECT DISTINCT
    dd.BigWFiscalWeekStartDate, 
    dd.BigWFiscalWeekEndDate
  FROM `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd 
)
, SUBS AS (
  SELECT 
    dd.BigWFiscalWeekStartDate,
    dd.BigWFiscalWeekEndDate,
    subscriber_customer_identifier AS subscriber_customer_identifier,
    crn
  FROM `gcp-wow-rwds-ai-subs-prod.EDX.EDX_subscriptions_data` e
  INNER JOIN dim_date dd 
    ON e.overall_subs_start_date BETWEEN dd.BigWFiscalWeekStartDate AND dd.BigWFiscalWeekEndDate
  WHERE staff_plan_flag IS NULL
)

Select 
dd.FiscalWeekStartDate,
'all_store' as Business_Destination,
IFNULL(tv.MarketType, 'National')   as MarketType,
IFNULL(tv.AggTvMarket, 'National')  as AggTvMarket,
IFNULL(tv.Region, 'National')       as Region,
count(distinct s.crn)  as rdws_paidSubsEdx_newSubscribers_cnts,
from SUBS S
  INNER JOIN 
      `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd
      ON S.BigWFiscalWeekStartDate = dd.CalendarDay
LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode` pc
ON S.crn = pc.crn
  LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_tv_markets_postcodes` tv
    ON pc.Postcode = tv.Postcode
where 1=1
group by 1,2,3,4,5
);


-- LIMIT 1000





/*----------------------------------------------------------------------------------------------------------*/
/*                                Section 2: BASE EARN                                                */
/*----------------------------------------------------------------------------------------------------------*/



-- select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_1_base` limit 100;
create or replace table `gcp-wow-rwds-ai-pobe-dev.angus.mmm_1_base`    as (
with points as (
SELECT 

'BaseEarn' AS campaign_name,
'Points' AS Metric,
'finance_fw_cost_bigw' AS Source,
'Points'  AS Metric_Name,
offer_type,
BigWFiscalWeekStartDate,
start_txn_date,
IFNULL(Business_Destination, 'all_store') as Business_Destination,
crn, 
offer_nbr,
Points_cost_excl_gst_sales*400 AS Metric_value,
FROM  `gcp-wow-rwds-ai-pobe-dev.angus.finance_fw_cost_bigw`   
WHERE 1=1

AND Offer_Type = 'Base-Earn'

)
, cost as (
SELECT 

'BaseEarn' AS campaign_name,
'Cost' AS Metric,
'finance_fw_cost_bigw' AS Source,
'Cost'  AS Metric_Name,
offer_type,
BigWFiscalWeekStartDate,
start_txn_date,
IFNULL(Business_Destination, 'all_store') as Business_Destination,
crn, 
offer_nbr,
Points_cost_excl_gst_sales AS Metric_value,
FROM  `gcp-wow-rwds-ai-pobe-dev.angus.finance_fw_cost_bigw`   
WHERE 1=1
AND Offer_Type = 'Base-Earn'
)


-- select sum(Metric_value) from cost

, merged as (
select * from points
union all
select * from cost
) 

, tv as (
Select 
IFNULL(a.Business_Destination, 'all_store') as Business_Destination,
CONCAT('rdws_', a.campaign_name, '_', Metric) AS variable,
IFNULL(tv.MarketType, 'National') as MarketType,
IFNULL(tv.AggTvMarket, 'National') as AggTvMarket,
IFNULL(tv.Region, 'National') as Region,
BigWFiscalWeekStartDate,
SUM(Metric_value) /*0.97*/ AS Metric_value
FROM merged a
LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode` pc
ON a.crn = pc.crn
  LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_tv_markets_postcodes` tv
    ON pc.Postcode = tv.Postcode
-- where a.crn = '33300000000001647752'
GROUP BY 1,2,3,4,5,6
) 

-- SELECT distinct variable FROM tv

, pivot_table AS (
  SELECT * FROM tv
  PIVOT (
    SUM( Metric_value) FOR variable IN (
      'rdws_BaseEarn_Cost',
      'rdws_BaseEarn_Points'
    )
  )
)

SELECT * FROM pivot_table
order by 1,2,3,4,5


);


---------------------------------------------------------------------------------------





select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_2_base` limit 100;

/*----------------------------------------------------------------------------------------------------------*/
/*                                Section 3: FINAL TABLBE [BASE + EVERYDAY EXTRA]                           */
/*----------------------------------------------------------------------------------------------------------*/


-- UNION ALL the following tables
select Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
BigWFiscalWeekStartDate, 
rdws_BaseEarn_Cost, 
rdws_BaseEarn_Points,
0.0 AS rdws_paidSubsEdx_10percDisc_cost,
0.0 AS rdws_paidSubsEdx_addPoints_points,
0.0 AS rdws_paidSubsEdx_addPoints_cost
from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_1_base`

union all 

select Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
FiscalWeekStartDate, 
0.0 AS rdws_BaseEarn_Cost, 
0.0 AS rdws_BaseEarn_Points,
rdws_paidSubsEdx_10percDisc_cost,
rdws_paidSubsEdx_addPoints_points,
rdws_paidSubsEdx_addPoints_cost
 -- ADD DUMMY VAIABLES: rdws_paidSubsEdx_10percDisc_cost, rdws_paidSubsEdx_addPoints_points, rdws_paidSubsEdx_addPoints_cost
from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_2_base` -- ADD DUMMY VAIABLES: rdws_BaseEarn_Cost, rdws_BaseEarn_Points






/*----------------------------------------------------------------------------------------------------------*/
/*                  Section 3: MEMBERSHIP [BOOSTER + ACTIVE + REDEEM]                                      */
/*----------------------------------------------------------------------------------------------------------*/


-- select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_3_members` limit 100;
create or replace table `gcp-wow-rwds-ai-pobe-dev.angus.mmm_3_members`    as (
with t1 as (
Select 
dd.FiscalWeekStartDate,
edr.crn,
'all_store' as Business_Destination,
bigw_booster_l4w_flag, 
if(bigw_booster_l4w_flag = true, edr.crn, '0')   as rdws_membrs_booster_l4w_cnts,
if(bigw_active_l4w_flag = true, edr.crn, '0')    as rdws_membrs_active_l4w_cnts,
if(bigw_redeemer_flag = true, edr.crn,' 0')      as rdws_membrs_redeemer_cnts,
IFNULL(tv.MarketType, 'National')   as MarketType,
IFNULL(tv.AggTvMarket, 'National')  as AggTvMarket,
IFNULL(tv.Region, 'National')       as Region,
from `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.edr_crn_flags_v` edr
  INNER JOIN 
      `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd
      ON edr.fw_end_date = dd.CalendarDay
LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode` pc
ON edr.crn = pc.crn
  LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_tv_markets_postcodes` tv
    ON pc.Postcode = tv.Postcode
where 1=1
) 

--  select  DISTINCT bigw_booster_l4w_flag
--   -- , rdws_membrs_active_l4w_cnts
--   -- , rdws_membrs_redeemer_cnts
-- --  COUNT(DISTINCT rdws_membrs_booster_l4w_cnts ) AS rdws_bigw_booster_l4w_cnts,
-- -- COUNT(DISTINCT rdws_membrs_active_l4w_cnts ) AS rdws_bigw_active_l4w_cnts,
-- -- COUNT(DISTINCT rdws_membrs_redeemer_cnts ) AS rdws_bigw_redeemer_cnts
 
 
--  from t1 limit 100

select
Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
FiscalWeekStartDate, 
SUM(0.0) AS rdws_BaseEarn_Cost, 
SUM(0.0) AS rdws_BaseEarn_Points,
SUM(0.0) AS rdws_paidSubsEdx_10percDisc_cost,
SUM(0.0) AS rdws_paidSubsEdx_addPoints_points,
SUM(0.0) AS rdws_paidSubsEdx_addPoints_cost,
COUNT(DISTINCT rdws_membrs_booster_l4w_cnts ) AS  rdws_bigw_booster_l4w_cnts,
COUNT(DISTINCT rdws_membrs_active_l4w_cnts ) AS   rdws_bigw_active_l4w_cnts,
COUNT(DISTINCT rdws_membrs_redeemer_cnts ) AS     rdws_bigw_redeemer_cnts
 from t1
  group by 1,2,3,4,5
);

SELECT 
SUM(rdws_bigw_booster_l4w_cnts) AS rdws_bigw_booster_l4w_cnts,
SUM(rdws_bigw_active_l4w_cnts) AS rdws_bigw_active_l4w_cnts,
SUM(rdws_bigw_redeemer_cnts) AS rdws_bigw_redeemer_cnts


from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_3_members` 
  group by 1,2,3,4,5
  )







/*----------------------------------------------------------------------------------------------------------*/
/*                                Section 3: BASE + EDX + MEMBERSHIP                                        */
/*----------------------------------------------------------------------------------------------------------*/



SELECT * FROM   `gcp-wow-rwds-ai-pobe-dev.angus.mmm_monthly_new_subscribers`  LIMIT 100
select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_final_stg1` limit 100;



create or replace table `gcp-wow-rwds-ai-pobe-dev.angus.mmm_final_stg1`    as (

  with unions as (
-- UNION ALL the following tables
select Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
BigWFiscalWeekStartDate, 
SUM(rdws_BaseEarn_Cost)   as rdws_BaseEarn_Cost, 
SUM(rdws_BaseEarn_Points) as rdws_BaseEarn_Points,
SUM(0.0) AS rdws_paidSubsEdx_10percDisc_cost,
SUM(0.0)AS rdws_paidSubsEdx_addPoints_points,
SUM(0.0) AS rdws_paidSubsEdx_addPoints_cost,
SUM(0.0) as rdws_bigw_booster_l4w_cnts,
SUM(0.0) as rdws_bigw_active_l4w_cnts,
SUM(0.0) as rdws_bigw_redeemer_cnts,
SUM(0.0) as rdws_paidSubsEdx_newSubs_cnts
from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_1_base`
  group by 1,2,3,4,5

union all 

select Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
FiscalWeekStartDate, 
SUM(0.0) AS rdws_BaseEarn_Cost, 
SUM(0.0) AS rdws_BaseEarn_Points,
SUM(rdws_paidSubsEdx_10percDisc_cost) as rdws_paidSubsEdx_10percDisc_cost,
SUM(rdws_paidSubsEdx_addPoints_points) as rdws_paidSubsEdx_addPoints_points,
SUM(rdws_paidSubsEdx_addPoints_cost) as rdws_paidSubsEdx_addPoints_cost,
SUM(0.0) as rdws_bigw_booster_l4w_cnts,
SUM(0.0) as rdws_bigw_active_l4w_cnts,
SUM(0.0) as rdws_bigw_redeemer_cnts,
SUM(0.0) as rdws_paidSubsEdx_newSubs_cnts
 -- ADD DUMMY VAIABLES: rdws_paidSubsEdx_10percDisc_cost, rdws_paidSubsEdx_addPoints_points, rdws_paidSubsEdx_addPoints_cost
from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_2_base` -- ADD DUMMY VAIABLES: rdws_BaseEarn_Cost, rdws_BaseEarn_Points
  group by 1,2,3,4,5

UNION ALL

select
Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
FiscalWeekStartDate, 
SUM(0.0) AS rdws_BaseEarn_Cost, 
SUM(0.0) AS rdws_BaseEarn_Points,
SUM(0.0) AS rdws_paidSubsEdx_10percDisc_cost,
SUM(0.0) AS rdws_paidSubsEdx_addPoints_points,
SUM(0.0) AS rdws_paidSubsEdx_addPoints_cost,
sum(rdws_bigw_booster_l4w_cnts ) AS rdws_bigw_booster_l4w_cnts,
sum(rdws_bigw_active_l4w_cnts ) AS rdws_bigw_active_l4w_cnts,
sum(rdws_bigw_redeemer_cnts ) AS rdws_bigw_redeemer_cnts,
SUM(0.0)  as rdws_paidSubsEdx_newSubs_cnts
 from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_3_members` 
  group by 1,2,3,4,5


UNION ALL

select
Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
FiscalWeekStartDate, 
SUM(0.0) AS rdws_BaseEarn_Cost, 
SUM(0.0) AS rdws_BaseEarn_Points,
SUM(0.0) AS rdws_paidSubsEdx_10percDisc_cost,
SUM(0.0) AS rdws_paidSubsEdx_addPoints_points,
SUM(0.0) AS rdws_paidSubsEdx_addPoints_cost,
SUM(0.0) AS rdws_bigw_booster_l4w_cnts,
SUM(0.0) AS rdws_bigw_active_l4w_cnts,
SUM(0.0) AS rdws_bigw_redeemer_cnts,
SUM(rdws_paidSubsEdx_newSubscribers_cnts) as rdws_paidSubsEdx_newSubs_cnts
 from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_monthly_new_subscribers`
  group by 1,2,3,4,5
  ) 


select
Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
BigWFiscalWeekStartDate, 
SUM(COALESCE(rdws_BaseEarn_Cost                ,0)   ) as rdws_BaseEarn_Cost,
SUM(COALESCE(rdws_BaseEarn_Points              ,0)   ) as rdws_BaseEarn_Points,
SUM(COALESCE(rdws_paidSubsEdx_10percDisc_cost  ,0)   ) as rdws_paidSubsEdx_10percDisc_cost,
SUM(COALESCE(rdws_paidSubsEdx_addPoints_points ,0)   ) as rdws_paidSubsEdx_addPoints_points,
SUM(COALESCE(rdws_paidSubsEdx_addPoints_cost   ,0)   ) as rdws_paidSubsEdx_addPoints_cost,
SUM(COALESCE(rdws_bigw_booster_l4w_cnts        ,0)   ) as rdws_bigw_booster_l4w_cnts,
SUM(COALESCE(rdws_bigw_active_l4w_cnts         ,0)   ) as  rdws_bigw_active_l4w_cnts,
SUM(COALESCE(rdws_bigw_redeemer_cnts           ,0)   ) as rdws_bigw_redeemer_cnts,
SUM(COALESCE(rdws_paidSubsEdx_newSubs_cnts     ,0)   ) as rdws_paidSubsEdx_newSubs_cnts
 from unions

  group by 1,2,3,4,5
order by 1,2,3,4,5


);




/*----------------------------------------------------------------------------------------------------------*/
/*                                Section 3: CAMPAIGNS                                          */
/*----------------------------------------------------------------------------------------------------------*/


-- select * from gcp-wow-rwds-ai-pobe-dev.angus.dim_bigw ORDER BY 1

create or replace table gcp-wow-rwds-ai-pobe-dev.angus.dim_bigw 
options(expiration_timestamp = timestamp_add(current_timestamp(), interval 30 day)) as (
select distinct campaign_code from gcp-wow-rwds-ai-pobe-dev.angus.dim_bigw_main_campaigns
);

-- select * from gcp-wow-rwds-ai-pobe-dev.angus.dim_mmm limit 1000;

---------------------------------------------------
---------   01 Add Offer Details




create or replace table gcp-wow-rwds-ai-pobe-dev.angus.dim_bigw_main_campaigns
options(expiration_timestamp = timestamp_add(current_timestamp(), interval 30 day)) as (
select 
  distinct 
  campaign_code, 
  ocm.offer_nbr, 
  offer_desc, 
  multiplier_value, 
  case 
    when LEFT(UPPER(campaign_code), 3) = ('WCT') then 'Category' 
    when UPPER(LEFT(campaign_code,3)) = 'WCV' then 'Trade'
    when UPPER(LEFT(campaign_code,3)) = 'WSP' then 'AMO'
  end as campaign_type,
  h.offer_name,
  -- UPPER(LEFT(campaign_code,3))

from `gcp-wow-rwds-ai-data-prod.rtl_data_model.offer_campaign_master` ocm 
join  `gcp-wow-rwds-ai-data-prod.rtl_data_model.offer_header` h on ocm.offer_nbr = h.offer_nbr
where UPPER(LEFT(campaign_code,3)) in ('WCT','WCV' , 'WSP')
);

select * from gcp-wow-rwds-ai-pobe-dev.angus.dim_mmm_offer_nbr limit 1000;

select *  
from `gcp-wow-rwds-ai-data-prod.rtl_data_model.offer_campaign_master` ocm limit 100


---------------------------------------------------
---------   01 Allocations by campagin  

create or replace table gcp-wow-rwds-ai-pobe-dev.angus.bigw_allocations  
options(expiration_timestamp = timestamp_add(current_timestamp(), interval 30 day)) as 
(
select 
    mmm.campaign_type
  , mmm.campaign_code
  , oa.offer_nbr
  , oa.crn as Allocation_CRN
  , campaign_start_date
  , concat(crn, oa.offer_nbr, campaign_start_date ) as unique_id 
    -- ,count(distinct oa.crn) Allocations
    -- ,count(distinct concat(crn,oa.offer_nbr, campaign_start_date )) total_allocations

FROM `gcp-wow-rwds-ai-data-prod.rtl_data_model.campaign_exec_details` c
inner join 
    `gcp-wow-rwds-ai-data-prod.rtl_data_model.campaign_customer_offer_allocation` oa 
on c.campaign_exec_id = oa.campaign_exec_id
inner join `gcp-wow-rwds-ai-pobe-dev.angus.dim_bigw_main_campaigns` mmm on oa.offer_nbr = mmm.offer_nbr
inner join `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd on date(oa.offer_allocation_start_date) = dd.calendarDay
where 1=1
-- and dd.calendarDay < '2024-04-01'
);

select * from  gcp-wow-rwds-ai-pobe-dev.angus.bws_allocations   limit 100

---------------------------------------------------
---------   01 Total boosts by campagin  

create or replace table gcp-wow-rwds-ai-pobe-dev.angus.bws_boosts 
options(expiration_timestamp = timestamp_add(current_timestamp(), interval 30 day)) as 
(
select 
      mmm.campaign_type
    , crn as Boost_CRN
    , concat(crn,o.offer_nbr, date_trunc(activation_datetime, day)) as unique_id

from `gcp-wow-rwds-ai-data-prod.rtl_data_model.customer_activated_offers` o
inner join `gcp-wow-rwds-ai-pobe-dev.angus.dim_mmm_offer_nbr` mmm on o.offer_nbr = mmm.offer_nbr
inner join `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd on date(o.activation_datetime) = dd.calendarDay
where 1=1
and activated_status not in ('CANCELLED','activation_failed') 
-- and dd.calendarDay < '2024-04-01'?
);





/*----------------------------------------------------------------------------------------------------------*/
/*                                Section 2: USING CAMPAIGN VIEW                                            */
/*----------------------------------------------------------------------------------------------------------*/

-- `gcp-wow-rwds-ai-pobe-dev.angus.finance_fw_cost_bigw`  

select * from `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.vw_bi_campaign` limit 100


CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.bigw_campaign`
OPTIONS(expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)) AS
(
  with dim_date AS (
  SELECT distinct
    dd.CalendarDay,
    dd.FiscalWeekStartDate, 
    dd.FiscalWeekEndDate
  FROM `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd
)

  SELECT dd.FiscalWeekStartDate, dd.FiscalWeekEndDate, dd.CalendarDay,
       bc.*,
  FROM dim_date dd 
  Left JOIN `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.vw_bi_campaign` bc on date(bc.campaign_start_date) = dd.CalendarDay
  JOIN `gcp-wow-rwds-ai-pobe-dev.angus.dim_bigw` c ON bc.campaign_code = c.campaign_code
);

 -- After doing some comparison between the old and the new  campaign tables, 
 -- I found that the results are close enough and the new table is easier to use with more information, so I'll be using the new table for the analysis.



FiscalWeekStartDate
CalendarDay
crn
campaign_code
campaign_start_date
campaign_end_date
reach_channel
dim_bigw_main_campaigns



----------------------    CLICKS, SENDS      --------------------------------
-- mmm_email_sent_cte` -- complete
-- email_clicks_cte` -- complete
-- app_sends`

SELECT distinct metric FROM   `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_metrics_stg1`  LIMIT 100



select * 

CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_metrics_stg1`
OPTIONS (expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)) AS (
WITH send_ids_cte 
AS (
  SELECT DISTINCT
      FiscalWeekStartDate,
      FiscalWeekEndDate,
      campaign_start_date,
      campaign_end_date,
      campaign_code,
      cost_value_excldgst, 
      allocate,
      
      CASE
          WHEN LEFT(UPPER(campaign_code), 3) = 'WCT' THEN 'Category'
          WHEN LEFT(UPPER(campaign_code), 3) = 'WCV' THEN 'Trade'
          WHEN LEFT(UPPER(campaign_code), 3) = 'WSP' THEN 'AMO'
          ELSE 'Unknown'
      END AS campaign_type,
      'email_sends' AS Metric,
       s_ids AS send_ids,
      SPLIT(s_ids, '|')[OFFSET(0)] AS CRN,
      SPLIT(s_ids, '|')[OFFSET(1)] AS offer_nbr
  FROM `gcp-wow-rwds-ai-pobe-dev.angus.bigw_campaign` a
  , UNNEST(a.send_ids_click) AS s_ids
  where reach_channel = 'Email Marketable'

),

click_ids_cte AS (
  SELECT DISTINCT
      FiscalWeekStartDate,
      FiscalWeekEndDate,
      campaign_start_date,
      campaign_end_date,
      campaign_code,
      cost_value_excldgst, 
      allocate,
      
      CASE
          WHEN LEFT(UPPER(campaign_code), 3) = 'WCT' THEN 'Category'
          WHEN LEFT(UPPER(campaign_code), 3) = 'WCV' THEN 'Trade'
          WHEN LEFT(UPPER(campaign_code), 3) = 'WSP' THEN 'AMO'
          ELSE 'Unknown'
      END AS campaign_type,
      'email_clicks' AS Metric,
      send_ids_click AS send_ids,
      SPLIT(c_ids, '|')[OFFSET(0)] AS CRN,
      SPLIT(c_ids, '|')[OFFSET(1)] AS offer_nbr
  FROM `gcp-wow-rwds-ai-pobe-dev.angus.bigw_campaign` a
  , UNNEST(a.send_ids_click) AS c_ids
  where reach_channel = 'Email Marketable'
)

select * from click_ids_cte limit 100

, app_sends_raw AS (
  SELECT DISTINCT
      FiscalWeekStartDate,
      FiscalWeekEndDate,
      campaign_start_date,
      campaign_end_date,
      campaign_code,
      cost_value_excldgst, 
      allocate,
      CASE
          WHEN LEFT(UPPER(campaign_code), 3) = 'WCT' THEN 'Category'
          WHEN LEFT(UPPER(campaign_code), 3) = 'WCV' THEN 'Trade'
          WHEN LEFT(UPPER(campaign_code), 3) = 'WSP' THEN 'AMO'
          ELSE 'Unknown'
      END AS campaign_type,
      'app_sends' AS Metric,
      app_ids AS send_ids,
      SPLIT(app_ids, '|')[OFFSET(0)] AS CRN,
      SPLIT(app_ids, '|')[OFFSET(1)] AS offer_nbr
  FROM `gcp-wow-rwds-ai-pobe-dev.angus.bigw_campaign` a
  , UNNEST(a.send_ids) AS app_ids
where allocate is not null
),

email_and_app_sends AS (
  SELECT 
      a.FiscalWeekStartDate,
      a.campaign_code,
      a.cost_value_excldgst,
      a.send_ids,

      NULL AS campaign_name,
      a.campaign_start_date,
      a.campaign_end_date,
      a.CRN,
      'email_and_app_sends' AS Metric,
      a.offer_nbr
  FROM send_ids_cte a
  INNER JOIN app_sends_raw b
    ON a.campaign_code = b.campaign_code
    AND a.campaign_start_date = b.campaign_start_date
    AND a.CRN = b.CRN
  where a.allocate is not null
)

-- select * from click_ids_cte limit 100

, email_and_app_clicks AS (
  SELECT 
      a.FiscalWeekStartDate,
      a.campaign_code,
      a.cost_value_excldgst,
      a.send_ids,

      NULL AS campaign_name,
      a.campaign_start_date,
      a.campaign_end_date,
      a.CRN,
      'email_and_app_clicks' AS Metric,
      a.offer_nbr
  FROM click_ids_cte a
  INNER JOIN app_sends_raw b
    ON a.campaign_code = b.campaign_code
    AND a.campaign_start_date = b.campaign_start_date
    AND a.CRN = b.CRN
  where a.allocate is not null
),

merged AS (
  -- Sends: Email and App  
  SELECT DISTINCT     
      FiscalWeekStartDate,
      campaign_code,
      cost_value_excldgst, 
      send_ids,

      NULL AS campaign_name,
      offer_nbr,
      CAST(campaign_start_date AS DATE) AS campaign_start_date,
      CAST(campaign_end_date AS DATE) AS campaign_end_date,
      'email_and_app_sends' as Metric,
      CRN
  FROM email_and_app_sends

  UNION ALL 

  -- Sends: Email only 
  SELECT DISTINCT     
      e.FiscalWeekStartDate,
      e.campaign_code,
      e.cost_value_excldgst, 
      e.send_ids,

      NULL AS campaign_name,
      e.offer_nbr,
      CAST(e.campaign_start_date AS DATE) AS campaign_start_date,
      CAST(e.campaign_end_date AS DATE) AS campaign_end_date,
      'email_sends' as Metric,
      e.CRN
  FROM send_ids_cte e
  LEFT JOIN email_and_app_sends ea
      ON e.campaign_code = ea.campaign_code
      AND e.CRN = ea.CRN
      AND e.campaign_start_date = ea.campaign_start_date
  WHERE ea.CRN IS NULL

  UNION ALL 

  -- Sends: App only 
  SELECT DISTINCT     
      a.FiscalWeekStartDate,
      a.campaign_code,
      a.cost_value_excldgst,
      a.send_ids,

      NULL AS campaign_name,
      a.offer_nbr,
      CAST(a.campaign_start_date AS DATE) AS campaign_start_date,
      CAST(a.campaign_end_date AS DATE) AS campaign_end_date,
      'app_sends' as Metric,
      a.CRN
  FROM app_sends_raw a
  LEFT JOIN email_and_app_sends ea
      ON a.campaign_code = ea.campaign_code
      AND a.CRN = ea.CRN
      AND a.campaign_start_date = ea.campaign_start_date
  WHERE ea.CRN IS NULL

  UNION ALL 

  -- Clicks: Email and App
  SELECT DISTINCT     
      FiscalWeekStartDate,
      campaign_code,
      cost_value_excldgst,
      send_ids, 

      NULL AS campaign_name,
      offer_nbr,
      CAST(campaign_start_date AS DATE) AS campaign_start_date,
      CAST(campaign_end_date AS DATE) AS campaign_end_date,
      'email_and_app_clicks' as Metric,
      CRN
  FROM email_and_app_clicks

  UNION ALL 

  -- Clicks: Email only
  SELECT DISTINCT    
      ea.FiscalWeekStartDate, 
      e.campaign_code,
      e.cost_value_excldgst, 
      e.send_ids,

      NULL AS campaign_name,
      e.offer_nbr,
      CAST(e.campaign_start_date AS DATE) AS campaign_start_date,
      CAST(e.campaign_end_date AS DATE) AS campaign_end_date,
      'email_clicks' as Metric,
      e.CRN
  FROM click_ids_cte e
  LEFT JOIN email_and_app_clicks ea
      ON e.campaign_code = ea.campaign_code
      AND e.CRN = ea.CRN
      AND e.campaign_start_date = ea.campaign_start_date
  WHERE ea.CRN IS NULL
)

SELECT 
  a.*
FROM merged a
);




-- /*----------------------------------------------------------------------------------------------------------*/
-- /*                          MPPING BUSINESS LOCATIONS                                                    */
-- /*----------------------------------------------------------------------------------------------------------*/
-- select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_to_business_map`  
-- where campaign_code in (SELECT distinct campaign_code 
--                         FROM  `gcp-wow-rwds-ai-pobe-dev.angus.bigw_marketingPlan_campaign_codes_static` b
--                         where b.Loyalty_funded != true)
-- order by 1, 2                        
-- limit 100;


-- select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_to_business_map` limit 1000



Create or replace table `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_to_business_map` as (


with srd_basket_stg as (
SELECT
    srd.fw_start_date,
    srd.campaign_code, 
     srd.campaign_start_date
  , DATE_DIFF(campaign_end_date, campaign_start_date, DAY) as campaign_duration,
     bd.Business,
prod_nbr, 
division_nbr,
basket_key,
    ROW_NUMBER() OVER (PARTITION BY 
                        bd.Business,
                        prod_nbr, 
                        division_nbr,
                        basket_key    ) as row_num,
    srd.sales_amt_incld_gst as sales

   -- fw_start_date, fw_end_date, campaign_start_date, campaign_end_date, offer_start_date, offer_end_date, start_txn_date


  from `gcp-wow-rwds-ai-data-prod.loyalty_bi_analytics.vw_bi_sales_reward_details` srd
  -- INNER JOIN `gcp-wow-ent-im-wowx-cust-prod.adp_wowx_dm_masterdata_view.dim_date_v` dd
  --   ON srd.start_txn_date = dd.CalendarDay
  -- INNER JOIN campaign_dets cd 
  --   ON srd.fw_start_date = cd.fw_start_date and srd.offer_nbr = cd.offer_id
  JOIN `gcp-wow-rwds-ai-data-prod.outbound.BigW_Destination_Business` bd
    ON bd.SubCategory = INITCAP(SRD.Category)
  where srd.crn not in ('-1','-2','0', '000') and srd.category <> 'Gift Cards' and srd.sales_amt_incld_gst > 0 and srd.division_nbr = '1060'
  -- and campaign_code is not null
  and staff_flag != true
  -- and srd.basket_key ='20230225123229003041220189'
  -- group by 1,2,3 --,4 --,5,6,7,8,10,11
)

, srd_basket as (
select  
campaign_code, 
campaign_start_date,
-- fw_start_date,
Business,
-- prod_nbr, 
-- division_nbr,
-- basket_key,
max(campaign_duration) as campaign_duration,
max(row_num) as dups,
sum(sales) as sales,
sum(sales) /max(row_num) as orig_price
from srd_basket_stg
GROUP BY
  1, 2, 3
)



, pivoted as (
  SELECT * FROM srd_basket
  PIVOT (
    SUM(orig_price) FOR Business IN ('Clothing', 'Everyday Celebrations & Events', 'Toys & Leisure', 'Home Living')
  )
  order by 1, 2
)

, piv_agg as (
select campaign_code
, campaign_start_date
-- fw_start_date,
    , SUM(Clothing) as Clothing
    , SUM(`Everyday Celebrations & Events`) as `Everyday Celebrations & Events`
    , SUM(`Toys & Leisure`) as `Toys & Leisure`
    , SUM(`Home Living`) as `Home Living`
  from pivoted 
GROUP BY
  1, 2
)


, calculated as (
  SELECT 
    campaign_code,
campaign_start_date,
-- fw_start_date,
    CASE WHEN Clothing > 1 THEN 1 ELSE 0 END AS clothing_dummy,
    CASE WHEN `Everyday Celebrations & Events` > 1 THEN 1 ELSE 0 END AS celebrations_dummy,
    CASE WHEN `Toys & Leisure` > 1 THEN 1 ELSE 0 END AS toys_dummy,
    CASE WHEN `Home Living` > 1 THEN 1 ELSE 0 END AS home_living_dummy,
    (CASE WHEN Clothing > 1 THEN 1 ELSE 0 END +
     CASE WHEN `Everyday Celebrations & Events` > 1 THEN 1 ELSE 0 END +
     CASE WHEN `Toys & Leisure` > 1 THEN 1 ELSE 0 END +
     CASE WHEN `Home Living` > 1 THEN 1 ELSE 0 END) AS total_dummy_sum
  FROM piv_agg
)

-- select * from calculated limit 100


, sales_with_percentage as (
  SELECT 
    campaign_code, 
campaign_start_date,
-- fw_start_date,
    COALESCE(Clothing, 0) AS clothing_sales,
    COALESCE(`Everyday Celebrations & Events`, 0) AS celebrations_sales,
    COALESCE(`Toys & Leisure`, 0) AS toys_sales,
    COALESCE(`Home Living`, 0) AS home_living_sales,
    (COALESCE(Clothing, 0) +
     COALESCE(`Everyday Celebrations & Events`, 0) +
     COALESCE(`Toys & Leisure`, 0) +
     COALESCE(`Home Living`, 0)) AS total_sales_sum
  FROM pivoted
)



, sales_agg as (
select campaign_code
, campaign_start_date
-- fw_start_date,
    , SUM(clothing_sales) as clothing_sales
    , SUM(celebrations_sales) as celebrations_sales
    , SUM(toys_sales) as toys_sales
    , SUM(home_living_sales) as home_living_sales
    , SUM(clothing_sales) + SUM(celebrations_sales) + SUM(toys_sales) + SUM(home_living_sales) as total_sales_sum
  from sales_with_percentage 
GROUP BY
  1, 2
)


-- select * from sales_with_percentage limit 100

, percentages as (
  SELECT 
    campaign_code, 
campaign_start_date,
-- fw_start_date,
    CASE WHEN total_sales_sum > 0 THEN (clothing_sales / total_sales_sum) * 100 ELSE 0 END AS clothing_percentage,
    CASE WHEN total_sales_sum > 0 THEN (celebrations_sales / total_sales_sum) * 100 ELSE 0 END AS celebrations_percentage,
    CASE WHEN total_sales_sum > 0 THEN (toys_sales / total_sales_sum) * 100 ELSE 0 END AS toys_percentage,
    CASE WHEN total_sales_sum > 0 THEN (home_living_sales / total_sales_sum) * 100 ELSE 0 END AS home_living_percentage,
    1 as all_store
  FROM sales_agg
)

-- select * from percentages limit 100

, percentages_with_dummies AS (
  SELECT 
    campaign_code, 
campaign_start_date,
-- fw_start_date,
    clothing_percentage, 
    celebrations_percentage, 
    toys_percentage, 
    home_living_percentage, 
    all_store,
    CASE WHEN clothing_percentage > 0 THEN 1 ELSE 0 END AS clothing_dummy,
    CASE WHEN celebrations_percentage > 0 THEN 1 ELSE 0 END AS celebrations_dummy,
    CASE WHEN toys_percentage > 0 THEN 1 ELSE 0 END AS toys_dummy,
    CASE WHEN home_living_percentage > 0 THEN 1 ELSE 0 END AS home_living_dummy
  FROM percentages
)



,
final_result AS (
  SELECT 
    campaign_code, 
campaign_start_date,
-- fw_start_date,
    clothing_percentage, 
    celebrations_percentage, 
    toys_percentage, 
    home_living_percentage,
    clothing_dummy, 
    celebrations_dummy, 
    toys_dummy, 
    home_living_dummy,
    CASE WHEN (clothing_dummy + celebrations_dummy + toys_dummy + home_living_dummy) = 4 THEN 1 ELSE 0 END AS all_store
  FROM percentages_with_dummies
)
SELECT * FROM final_result
);


-- /*----------------------------------------------------------------------------------------------------------*/
-- /*                          MAPPING BUSINESS LOCATIONS                                                    */
-- /*----------------------------------------------------------------------------------------------------------*/

-- APPLYING THE BUSINESS MAPPING TO THE CAMPAIGN DATA

-------------------------------------------------------------------------------------
---------------   01. CREATING STREAMS FOR THE CAMPAIGN DATA
-- CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_metrics_stg2` AS (
--     SELECT DISTINCT *,
--         CASE 
--             WHEN LEFT(UPPER(campaign_code), 3) = 'WCT' THEN 'Category' 
--             WHEN UPPER(LEFT(campaign_code, 3)) = 'WCV' THEN 'Trade'
--             WHEN UPPER(LEFT(campaign_code, 3)) = 'WSP' THEN 'SupplierFunded'
--         END AS campaign_type
--     FROM `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_metrics_stg1`
--     ORDER BY 1
--     LIMIT 100
-- );

-- SELECT * FROM `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_to_business_map` LIMIT 100;

select distinct variable  from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_data` limit 100

-------------------------------------------------------------------------------------
---------------   02. MERGE THE BUSINESS MAPPING TO THE CAMPAIGN DATA
CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_data` AS (
WITH campaign_data AS (
    SELECT 
        a.campaign_code,
        a.campaign_start_date,
        IFNULL(tv.MarketType, 'National') AS MarketType,
        IFNULL(tv.AggTvMarket, 'National') AS AggTvMarket,
        IFNULL(tv.Region, 'National') AS Region,
        a.FiscalWeekStartDate,
        a.CRN,
        Metric, 
        CONCAT(a.campaign_code, a.CRN, a.offer_nbr, a.campaign_start_date) AS UID,
        CASE 
            WHEN LEFT(UPPER(campaign_code), 3) = 'WCT' THEN 'Category' 
            WHEN UPPER(LEFT(campaign_code, 3)) = 'WCV' THEN 'Trade'
            WHEN UPPER(LEFT(campaign_code, 3)) = 'WSP' THEN 'SupplierFunded'
        END AS campaign_type
        , cost_value_excldgst
        , send_ids
    FROM `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_metrics_stg1` a
    LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_member_postcode` pc
        ON a.crn = pc.crn
    LEFT JOIN `gcp-wow-rwds-ai-pobe-dev.angus.mmm_tv_markets_postcodes` tv
        ON pc.Postcode = tv.Postcode
)

Select *  ,
        CASE 
            WHEN a.campaign_type = 'SupplierFunded' THEN CONCAT('rdws_ATL_', a.campaign_type, '_', a.Metric) 
            ELSE CONCAT('rdws_BTL_', a.campaign_type, '_', a.Metric)
        END AS variable

from campaign_data a
-- limit 100

);
-- 03. Reshape business data by unpivoting business destinations

-- select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_data` limit 100



---------------   02. MERGE THE BUSINESS MAPPING TO THE CAMPAIGN DATA
CREATE OR REPLACE TABLE `gcp-wow-rwds-ai-pobe-dev.angus.cmm_BIGW_campaign_data` AS (
with  reshaped_data AS (
    SELECT 
        campaign_code,
        date(campaign_start_date) AS campaign_start_date,
        Business_Destination,
        percentage
    FROM `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_to_business_map`
    UNPIVOT (
            percentage FOR Business_Destination IN (
            clothing_percentage,
            celebrations_percentage,
            toys_percentage,
            home_living_percentage
        )
    )
)

-- select * from reshaped_data limit 100

, dedup1 as (
SELECT 
    CASE WHEN Business_Destination  = 'celebrations_percentage'           THEN 'Everyday Celebrations & Events' 
          WHEN Business_Destination = 'clothing_percentage'          THEN 'Clothing'
          WHEN Business_Destination = 'home_living_percentage'         THEN 'Home Living' 
          WHEN Business_Destination = 'toys_percentage'         THEN 'Toys & Leisure' 
           ELSE NULL END AS Business_Destination,
cmp.MarketType, 
cmp.AggTvMarket, 
cmp.Region, 
cmp.FiscalWeekStartDate, 
  cmp.campaign_code,
  cmp.campaign_start_date,
  cmp.UID,
  Metric, 
  campaign_type, 
  CASE WHEN r.campaign_code is null then 1 else 0 end as count_missing,
  1 AS cts,
  cost_value_excldgst,
  send_ids,
  r.percentage, 
  AVG(r.percentage)--OVER (PARTITION BY   r.Business_Destination,
                   --                    cmp.MarketType, 
                   --                    cmp.AggTvMarket, 
                   --                    cmp.Region, 
                   --                    cmp.FiscalWeekStartDate, 
                   --                      cmp.campaign_code,
                   --                      cmp.campaign_start_date) 
                        as avg_percentage,
    AVG(CASE WHEN r.percentage > 0 THEN r.percentage ELSE NULL END) 
                  OVER (PARTITION BY   r.Business_Destination,
                                        cmp.MarketType, 
                                        cmp.AggTvMarket, 
                                        cmp.Region, 
                                        cmp.FiscalWeekStartDate, 
                                          cmp.campaign_code,
                                          cmp.campaign_start_date) 
                        as avg_percentage_adj,
  CONCAT(UID,r.Business_Destination) as UID_BD,


  CASE WHEN Business_Destination = 'celebrations_percentage' then  r.percentage ELSE NULL END AS celebrations_percentage,
  CASE WHEN Business_Destination = 'clothing_percentage' then  r.percentage ELSE NULL END AS clothing_percentage,
  CASE WHEN Business_Destination = 'home_living_percentage' then  r.percentage ELSE NULL END AS home_living_percentage,
  CASE WHEN Business_Destination = 'toys_percentage' then  r.percentage ELSE NULL END AS toys_percentage,
  ROW_NUMBER() OVER (PARTITION BY send_ids, cmp.campaign_start_date, Business_Destination  ) as row_num

  --  COUNT(DISTINCT cmp.UID) AS audience, --/* AVG(r.percentage) / 100*/ 
  --  COUNT(DISTINCT cmp.UID)  * AVG(COALESCE(r.percentage,0) / 100) AS adjusted_audience
FROM `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_data` CMP
LEFT JOIN reshaped_data r
    ON CMP.campaign_code = r.campaign_code AND CMP.campaign_start_date = r.campaign_start_date
-- GROUP BY   r.Business_Destination,
-- cmp.MarketType, 
-- cmp.AggTvMarket, 
-- cmp.Region, 
WHERE cmp.FiscalWeekStartDate = '2024-06-10'
--   cmp.campaign_code,
--   cmp.campaign_start_date
-- where send_ids = '3300000000002071832|9312987'
-- LIMIT 100
) 

, dedup2 as (
select * ,
    ROW_NUMBER() OVER (PARTITION BY UID_BD) as row_num2
from dedup1
where row_num = 1 
--  limit 1000
) 

, tv as (
select 
Business_Destination, 
MarketType, 
AggTvMarket, 
Region, 
FiscalWeekStartDate, 
Metric, 
campaign_type, 
count_missing, 
cts, 
cost_value_excldgst, 
send_ids, 
percentage, 
avg_percentage, 
avg_percentage_adj, 
UID_BD, 
celebrations_percentage, 
clothing_percentage, 
home_living_percentage, 
toys_percentage, 
row_num, 
row_num2
from dedup2
where row_num2 > 1 
)

, pivot_table AS (
  SELECT * FROM tv
  PIVOT (
    SUM( Metric_value) FOR variable IN (
      'rdws_BaseEarn_Cost',
      'rdws_BaseEarn_Points'
    )
  )
)

SELECT * FROM pivot_table
order by 1,2,3,4,5




);






select * from `gcp-wow-rwds-ai-pobe-dev.angus.cmm_BIGW_campaign_data`
-- where send_ids = '1000000000000000528|9676541'
-- where row_num > 
order by 1,2,3,4,5,6,7,8

-- where row_num > 1 
 limit 1000




select * from `gcp-wow-rwds-ai-pobe-dev.angus.mmm_campaign_metrics_stg1` limit 1000










IFNULL(a.Business_Destination, 'all_store') as Business_Destination,



select 
a.crn,
a.FiscalWeekStartDate,
IFNULL(a.Business_Destination, 'all_store') as Business_Destination,
-- CONCAT('rdws_', 'paidSubsEdx', '_', MetricName) AS variable,
IFNULL(tv.MarketType, 'National') as MarketType,
IFNULL(tv.AggTvMarket, 'National') as AggTvMarket,
IFNULL(tv.Region, 'National') as Region,
SUM(MetricValue)  AS rdws_paidSubsEdx_10percDisc_cost,
SUM(Metric2)      AS rdws_paidSubsEdx_addPoints_cost,
SUM(MetricValue3) AS rdws_paidSubsEdx_addPoints_points


-- where a.crn = '33300000000001647752'


