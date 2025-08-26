-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 01, 2024 at 11:54 AM
-- Server version: 8.0.36-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medsers`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int UNSIGNED NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(35) NOT NULL,
  `status` enum('1','2') NOT NULL COMMENT '1=active,2=inactive',
  `role_id` int NOT NULL,
  `access_token` text NOT NULL,
  `permission_reset` enum('0','1') NOT NULL DEFAULT '0',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `firstname`, `lastname`, `email`, `password`, `status`, `role_id`, `access_token`, `permission_reset`, `created`, `updated`) VALUES
(1, 'Super', 'Admin', 'admin@admin.com', '25d55ad283aa400af464c76d713c07ad', '1', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiU3VwZXIiLCJsYXN0bmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJzdGF0dXMiOiIxIiwicm9sZV9pZCI6MSwicGVybWlzc2lvbl9yZXNldCI6IjAiLCJjcmVhdGVkIjoiMjAyMi0xMi0yMFQxMDoyMjo1Ni4wMDBaIiwidXBkYXRlZCI6IjIwMjQtMDItMDFUMDM6NTI6MDIuMDAwWiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNjc2NzMyNywiZXhwIjoxNzA2Nzc0NTI3fQ.MSx0QFZUlt5YdQPEXsIr3M5BDOihq2iV5SgzWbh7Wsc', '0', '2022-12-20 15:52:56', '2024-02-01 11:32:07'),
(83, 'Jay', 'Parmar', 'jay@admin.com', '25d55ad283aa400af464c76d713c07ad', '1', 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODMsImZpcnN0bmFtZSI6IkpheSIsImxhc3RuYW1lIjoiUGFybWFyIiwiZW1haWwiOiJqYXlAYWRtaW4uY29tIiwic3RhdHVzIjoiMSIsInJvbGVfaWQiOjEyLCJwZXJtaXNzaW9uX3Jlc2V0IjoiMCIsImNyZWF0ZWQiOiIyMDIzLTAzLTIxVDE0OjI5OjI5LjAwMFoiLCJ1cGRhdGVkIjoiMjAyMy0xMS0wNlQwNDo0Mjo1MC4wMDBaIiwiZnVsbE5hbWUiOiJKYXkgUGFybWFyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk5MjQ2NTYzLCJleHAiOjE2OTkyNTM3NjN9.QkPmTIt6pcyvc6AVybgZ_-hBO0Gd2bra0a-u7znK38U', '0', '2023-03-21 19:59:29', '2023-11-06 10:26:12');

-- --------------------------------------------------------

--
-- Table structure for table `channels`
--

CREATE TABLE `channels` (
  `id` int NOT NULL,
  `channel_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_unit`
--

CREATE TABLE `master_unit` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `symbol` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_unit`
--

INSERT INTO `master_unit` (`id`, `name`, `symbol`, `status`) VALUES
(1, 'Milligram', 'mg', 'active'),
(2, 'Gram', 'g', 'active'),
(3, 'Kilogram', 'kg', 'active'),
(4, 'Milliliter', 'ml', 'active'),
(5, 'Liter', 'l', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `caption` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci,
  `reply_id` int DEFAULT NULL,
  `type` enum('image','text','video','audio','other') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `wp_from` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `wp_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `wp_to` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `read_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `asset_url` varchar(600) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pharmacy_id` int DEFAULT NULL,
  `user_address_id` int DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `status` enum('awaiting','quote_sent','processing','transit','complete') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'awaiting',
  `image_count` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacies`
--

CREATE TABLE `pharmacies` (
  `id` int NOT NULL,
  `pharmacy_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `owner_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `license_no` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `whatsapp_no` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `bank_ifsc` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `bank_account_number` varchar(225) COLLATE utf8mb4_general_ci NOT NULL,
  `awards` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pharmacies`
--

INSERT INTO `pharmacies` (`id`, `pharmacy_name`, `owner_name`, `email`, `license_no`, `whatsapp_no`, `bank_ifsc`, `bank_account_number`, `awards`, `lat`, `lng`, `status`) VALUES
(1, 'jay pharmacy', 'jay parmar', 'jaysspspsp@gmail.com', 'asdbasdb', '9898528257', 'BARB0DAHKUT', '1516100000001', 'asd', 23.2444, 69.6547, 'active'),
(2, 'any pharmacy', 'jay parmar_2', 'jaysspspsp@gmail.com', 'asdbasdb', '9898528257', 'BARB0DAHKUT', '1516100000001', 'asd', 23.2428, 69.6608, 'active'),
(3, 'harshad pharmacy', 'jay parmar_3', 'jaysspspsp@gmail.com', 'asdbasdb', '9898528257', 'BARB0DAHKUT', '1516100000001', 'asd', 23.2428, 69.6608, 'active'),
(4, 'mitesh pharmacy', 'mitesh bhagwant', 'jaysspspsp@gmail.com', 'asdbasdb', '9898528257', 'BARB0DAHKUT', '1516100000001', 'asd', 23.2428, 69.6608, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `pharmacy_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `discount` float NOT NULL DEFAULT '0',
  `tax` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_type` enum('flat','percentage') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'flat',
  `quote_status` enum('sent','received') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'sent',
  `qoute_discount` decimal(10,2) DEFAULT NULL,
  `qoute_total` decimal(10,2) DEFAULT '0.00',
  `final_total` decimal(10,2) DEFAULT '0.00',
  `validation_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `quotes`
--
DELIMITER $$
CREATE TRIGGER `calculate_final_total_from_discount_and_tax` BEFORE UPDATE ON `quotes` FOR EACH ROW BEGIN
    IF NEW.discount_type = 'flat' THEN
        SET NEW.qoute_discount = NEW.discount;
    ELSEIF NEW.discount_type = 'percentage' THEN
        SET NEW.qoute_discount = (NEW.discount / 100) * NEW.qoute_total;
    END IF;

    SET NEW.final_total = (NEW.qoute_total - NEW.qoute_discount) * (1 + NEW.tax / 100);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_final_total` BEFORE UPDATE ON `quotes` FOR EACH ROW BEGIN
    SET NEW.final_total = NEW.qoute_total - NEW.qoute_discount;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_final_total_from_type` BEFORE UPDATE ON `quotes` FOR EACH ROW BEGIN
    IF NEW.discount_type = 'flat' THEN
        SET NEW.qoute_discount = NEW.discount;
    ELSEIF NEW.discount_type = 'percentage' THEN
        SET NEW.qoute_discount = (NEW.discount / 100) * NEW.qoute_total;
    END IF;
    
    SET NEW.final_total = NEW.qoute_total - NEW.qoute_discount;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `quote_items`
--

CREATE TABLE `quote_items` (
  `id` int NOT NULL,
  `quote_id` int DEFAULT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `unit_amount` int DEFAULT '0',
  `qty` int NOT NULL DEFAULT '0',
  `unit_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` float NOT NULL,
  `discount` int NOT NULL,
  `item_discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_type` enum('none','flat','percentage') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'none',
  `item_total` decimal(10,2) DEFAULT NULL,
  `unit` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `quote_items`
--
DELIMITER $$
CREATE TRIGGER `after_quote_item_delete` AFTER DELETE ON `quote_items` FOR EACH ROW BEGIN
    DECLARE total_amount DECIMAL(10, 2);

    -- Calculate the total amount for the corresponding quote_id
    SELECT SUM(item_total) INTO total_amount
    FROM quote_items
    WHERE quote_id = OLD.quote_id;

    -- Update the final_total in the quotes table
    UPDATE quotes
    SET qoute_total = total_amount
    WHERE id = OLD.quote_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `insert_quote_item_update` AFTER INSERT ON `quote_items` FOR EACH ROW BEGIN
    DECLARE total DECIMAL(10, 2);

    -- Calculate the sum of item_total for the corresponding quote_id
    SELECT SUM(item_total) INTO total
    FROM quote_items
    WHERE quote_id = NEW.quote_id;

    -- Update quote_total in quotes table
    UPDATE quotes
    SET qoute_total = total
    WHERE id = NEW.quote_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_quote_item_details` BEFORE INSERT ON `quote_items` FOR EACH ROW BEGIN
    -- Calculate the price (unit_amount * qty)
    SET NEW.price = NEW.unit_amount * NEW.qty;

    -- Calculate item_discount based on discount_type
    IF NEW.discount_type = 'flat' THEN
        SET NEW.item_discount = NEW.discount;
    ELSEIF NEW.discount_type = 'percentage' THEN
        SET NEW.item_discount = (NEW.discount / 100) * NEW.price;
    END IF;

    -- Calculate item_total (price - item_discount)
    SET NEW.item_total = NEW.price - NEW.item_discount;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_quote_item_details_update` BEFORE UPDATE ON `quote_items` FOR EACH ROW BEGIN
    -- Calculate the price (unit_amount * qty)
    SET NEW.price = NEW.unit_amount * NEW.qty;

    -- Calculate item_discount based on discount_type
    IF NEW.discount_type = 'flat' THEN
        SET NEW.item_discount = NEW.discount;
    ELSEIF NEW.discount_type = 'percentage' THEN
        SET NEW.item_discount = (NEW.discount / 100) * NEW.price;
    END IF;

    -- Calculate item_total (price - item_discount)
    SET NEW.item_total = NEW.price - NEW.item_discount;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_quote_item_detailss` BEFORE UPDATE ON `quote_items` FOR EACH ROW BEGIN
    -- Calculate the price (unit_amount * qty)
    SET NEW.price = NEW.unit_amount * NEW.qty;

    -- Calculate item_discount based on discount_type
    IF NEW.discount_type = 'flat' THEN
        SET NEW.item_discount = NEW.discount;
    ELSEIF NEW.discount_type = 'percentage' THEN
        SET NEW.item_discount = (NEW.discount / 100) * NEW.price;
    END IF;

    -- Calculate item_total (price - item_discount)
    SET NEW.item_total = NEW.price - NEW.item_discount;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_quote_total` AFTER UPDATE ON `quote_items` FOR EACH ROW BEGIN
    DECLARE total DECIMAL(10, 2);

    -- Calculate the sum of item_total for the corresponding quote_id
    SELECT SUM(item_total) INTO total
    FROM quote_items
    WHERE quote_id = NEW.quote_id;

    -- Update quote_total in quotes table
    UPDATE quotes
    SET qoute_total = total
    WHERE id = NEW.quote_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `permissions` varchar(255) NOT NULL DEFAULT '[]'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `permissions`) VALUES
(1, 'Admin', '[\"admin-read\", \"admin-write\", \"admin-update\", \"admin-delete\", \"chat-read\", \"chat-write\", \"chat-update\", \"chat-delete\", \"settings-read\", \"settings-write\", \"settings-update\", \"channels-read\", \"channels-write\", \"channels-update\"]'),
(2, 'User', '[\"user-read\", \"user-write\", \"user-update\", \"user-delete\"]'),
(3, 'Guest', '[\"guest-read\"]');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otp_time` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `api_token` text COLLATE utf8mb4_general_ci,
  `otp` int DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` int NOT NULL,
  `number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `formatted_address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `place_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address1` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address2` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address_response` text COLLATE utf8mb4_general_ci NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `number`, `title`, `full_name`, `phone`, `formatted_address`, `place_id`, `address1`, `address2`, `address`, `address_response`, `lat`, `lng`, `status`, `created_at`, `updated_at`) VALUES
(1, '919016379374', 'Parmar', 'Jay', '9898528257', 'A1/21, Jalaram Society, Vijay Nagar, Bhuj, Gujarat 370020, India', 'ChIJ-QQblfzhUDkR73jazhiHK4s', 'add1', 'add2', 'A1/21, Jalaram Society, Vijay Nagar, Bhuj, Gujarat 370020, India', '{\"address_components\":[{\"long_name\":\"A1/21\",\"short_name\":\"A1/21\",\"types\":[\"premise\"]},{\"long_name\":\"Jalaram Society\",\"short_name\":\"Jalaram Society\",\"types\":[\"neighborhood\",\"political\"]},{\"long_name\":\"Vijay Nagar\",\"short_name\":\"Vijay Nagar\",\"types\":[\"political\",\"sublocality\",\"sublocality_level_1\"]},{\"long_name\":\"Bhuj\",\"short_name\":\"Bhuj\",\"types\":[\"locality\",\"political\"]},{\"long_name\":\"Kachchh\",\"short_name\":\"Kachchh\",\"types\":[\"administrative_area_level_3\",\"political\"]},{\"long_name\":\"Gujarat\",\"short_name\":\"GJ\",\"types\":[\"administrative_area_level_1\",\"political\"]},{\"long_name\":\"India\",\"short_name\":\"IN\",\"types\":[\"country\",\"political\"]},{\"long_name\":\"370020\",\"short_name\":\"370020\",\"types\":[\"postal_code\"]}],\"formatted_address\":\"A1/21, Jalaram Society, Vijay Nagar, Bhuj, Gujarat 370020, India\",\"geometry\":{\"location\":{\"lat\":23.243782,\"lng\":69.673717},\"location_type\":\"ROOFTOP\",\"viewport\":{\"south\":23.2424330197085,\"west\":69.67236801970849,\"north\":23.2451309802915,\"east\":69.6750659802915}},\"place_id\":\"ChIJ-QQblfzhUDkR73jazhiHK4s\",\"plus_code\":{\"compound_code\":\"6MVF+GF Bhuj, Gujarat, India\",\"global_code\":\"7JMF6MVF+GF\"},\"types\":[\"street_address\"]}', 23.2439, 69.6739, 'active', '2023-12-04 04:40:35', NULL),
(2, '919016379374', 'office', 'Jay', '9726572640', '6PW4+R4X, Junavas, Madhapar, Bhuj, Gujarat 370020, India', 'ChIJ3a2OkozhUDkRD8ap6byJ6GU', 'add1', 'add2', '6PW4+R4X, Junavas, Madhapar, Bhuj, Gujarat 370020, India', '{\"address_components\":[{\"long_name\":\"6PW4+R4X\",\"short_name\":\"6PW4+R4X\",\"types\":[\"plus_code\"]},{\"long_name\":\"Junavas\",\"short_name\":\"Junavas\",\"types\":[\"political\",\"sublocality\",\"sublocality_level_2\"]},{\"long_name\":\"Madhapar\",\"short_name\":\"Madhapar\",\"types\":[\"political\",\"sublocality\",\"sublocality_level_1\"]},{\"long_name\":\"Bhuj\",\"short_name\":\"Bhuj\",\"types\":[\"locality\",\"political\"]},{\"long_name\":\"Kachchh\",\"short_name\":\"Kachchh\",\"types\":[\"administrative_area_level_3\",\"political\"]},{\"long_name\":\"Gujarat\",\"short_name\":\"GJ\",\"types\":[\"administrative_area_level_1\",\"political\"]},{\"long_name\":\"India\",\"short_name\":\"IN\",\"types\":[\"country\",\"political\"]},{\"long_name\":\"370020\",\"short_name\":\"370020\",\"types\":[\"postal_code\"]}],\"formatted_address\":\"6PW4+R4X, Junavas, Madhapar, Bhuj, Gujarat 370020, India\",\"geometry\":{\"location\":{\"lat\":23.2471112,\"lng\":69.7053713},\"location_type\":\"GEOMETRIC_CENTER\",\"viewport\":{\"south\":23.2457622197085,\"west\":69.7040223197085,\"north\":23.2484601802915,\"east\":69.7067202802915}},\"place_id\":\"ChIJ3a2OkozhUDkRD8ap6byJ6GU\",\"types\":[\"electronics_store\",\"establishment\",\"point_of_interest\",\"store\"]}', 23.2471, 69.7052, 'active', '2023-12-04 04:41:28', NULL),
(3, '919898528257', 'office', 'Jay', '9726572640', '6PW4+R4X, Junavas, Madhapar, Bhuj, Gujarat 370020, India', 'ChIJ3a2OkozhUDkRD8ap6byJ6GU', 'add1', 'add2', '6PW4+R4X, Junavas, Madhapar, Bhuj, Gujarat 370020, India', '{\"address_components\":[{\"long_name\":\"6PW4+R4X\",\"short_name\":\"6PW4+R4X\",\"types\":[\"plus_code\"]},{\"long_name\":\"Junavas\",\"short_name\":\"Junavas\",\"types\":[\"political\",\"sublocality\",\"sublocality_level_2\"]},{\"long_name\":\"Madhapar\",\"short_name\":\"Madhapar\",\"types\":[\"political\",\"sublocality\",\"sublocality_level_1\"]},{\"long_name\":\"Bhuj\",\"short_name\":\"Bhuj\",\"types\":[\"locality\",\"political\"]},{\"long_name\":\"Kachchh\",\"short_name\":\"Kachchh\",\"types\":[\"administrative_area_level_3\",\"political\"]},{\"long_name\":\"Gujarat\",\"short_name\":\"GJ\",\"types\":[\"administrative_area_level_1\",\"political\"]},{\"long_name\":\"India\",\"short_name\":\"IN\",\"types\":[\"country\",\"political\"]},{\"long_name\":\"370020\",\"short_name\":\"370020\",\"types\":[\"postal_code\"]}],\"formatted_address\":\"6PW4+R4X, Junavas, Madhapar, Bhuj, Gujarat 370020, India\",\"geometry\":{\"location\":{\"lat\":23.2471112,\"lng\":69.7053713},\"location_type\":\"GEOMETRIC_CENTER\",\"viewport\":{\"south\":23.2457622197085,\"west\":69.7040223197085,\"north\":23.2484601802915,\"east\":69.7067202802915}},\"place_id\":\"ChIJ3a2OkozhUDkRD8ap6byJ6GU\",\"types\":[\"electronics_store\",\"establishment\",\"point_of_interest\",\"store\"]}', 23.2471, 69.7052, 'active', '2023-12-04 04:41:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_location`
--

CREATE TABLE `user_location` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mobile_number` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` decimal(18,8) NOT NULL,
  `longitude` decimal(18,10) NOT NULL,
  `user_entered_address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `master_unit`
--
ALTER TABLE `master_unit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `symbol` (`symbol`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacies`
--
ALTER TABLE `pharmacies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_quotes_pharmacy_id` (`pharmacy_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `quote_items`
--
ALTER TABLE `quote_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_location`
--
ALTER TABLE `user_location`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=182;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=234;

--
-- AUTO_INCREMENT for table `pharmacies`
--
ALTER TABLE `pharmacies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
