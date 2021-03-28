/*
 Navicat Premium Data Transfer

 Source Server         : site
 Source Server Type    : PostgreSQL
 Source Server Version : 100010
 Source Host           : localhost:5432
 Source Catalog        : Hidden
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100010
 File Encoding         : 65001

 Date: 28/03/2021 02:58:35
*/


-- ----------------------------
-- Table structure for website_coupon
-- ----------------------------
DROP TABLE IF EXISTS "public"."website_coupon";
CREATE TABLE "public"."website_coupon" (
  "id" int4 NOT NULL DEFAULT NULL,
  "citem_name" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "citem_id" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "c_count" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "c_category" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "cupon" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "permanent" bool DEFAULT false
)
;

-- ----------------------------
-- Records of website_coupon
-- ----------------------------
INSERT INTO "public"."website_coupon" VALUES (5, 'CAIXA OA (1UN)', '1302266000', '1', '3', 'caixas123', 't');
INSERT INTO "public"."website_coupon" VALUES (4, 'CAIXA MIX PBIC (1UN)', '1301619000', '1', '3', 'caixas123', 't');
INSERT INTO "public"."website_coupon" VALUES (6, 'AUG A3 HYBRIDMAN2 (7D)', '1000033122', '604800', '1', 'boasvindas', 't');
INSERT INTO "public"."website_coupon" VALUES (2, 'AUG A3 COMIC (7D)', '100003345', '604800', '1', 'boasvindas', 't');
INSERT INTO "public"."website_coupon" VALUES (1, 'AUG A3 HYBRIDMAN (7D)', '100003318', '604800', '1', 'boasvindas', 't');

-- ----------------------------
-- Table structure for website_coupon_usage
-- ----------------------------
DROP TABLE IF EXISTS "public"."website_coupon_usage";
CREATE TABLE "public"."website_coupon_usage" (
  "login" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "coupon" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "items" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "id" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL
)
;

-- ----------------------------
-- Records of website_coupon_usage
-- ----------------------------
INSERT INTO "public"."website_coupon_usage" VALUES ('ohmxd1', 'boasvindas', 'AUG A3 HYBRIDMAN (7D),AUG A3 COMIC (7D),AUG A3 HYBRIDMAN2 (7D),', '#2DG-GVKM-BVS');

-- ----------------------------
-- Table structure for website_pin
-- ----------------------------
DROP TABLE IF EXISTS "public"."website_pin";
CREATE TABLE "public"."website_pin" (
  "pin" numeric DEFAULT NULL,
  "value" int4 DEFAULT NULL,
  "type" int4 DEFAULT NULL
)
;

-- ----------------------------
-- Table structure for website_pin_history
-- ----------------------------
DROP TABLE IF EXISTS "public"."website_pin_history";
CREATE TABLE "public"."website_pin_history" (
  "key" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "pin" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "value" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "owner" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "data" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL
)
;

-- ----------------------------
-- Records of website_pin_history
-- ----------------------------
INSERT INTO "public"."website_pin_history" VALUES ('#59I-0F3K-THJ', '87518496257495527', '20000', 'kaisonnat79', '10/10/2030');
INSERT INTO "public"."website_pin_history" VALUES ('#LUX-YO3H-Y8M', '87518496257495528', '200000', 'kaisonnat79', '10/10/2030');
INSERT INTO "public"."website_pin_history" VALUES ('#5RC-ODT4-Q67', '87518496257495527', '50000', 'arif25hours', '10/10/2030');
INSERT INTO "public"."website_pin_history" VALUES ('#0MS-7REI-UKQ', '87518496257494715', '50000', 'raiisus01za', '10/10/2030');
INSERT INTO "public"."website_pin_history" VALUES ('#UVT-V8AY-Q3A', '4587518496257495528', '20000', 'ohmxd1', '10/10/2030');

-- ----------------------------
-- Primary Key structure for table website_coupon
-- ----------------------------
ALTER TABLE "public"."website_coupon" ADD CONSTRAINT "cupon_pkey" PRIMARY KEY ("id");
