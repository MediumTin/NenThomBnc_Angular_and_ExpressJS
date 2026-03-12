-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percent','amount') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) DEFAULT NULL,
  `max_discount_value` decimal(10,2) DEFAULT NULL,
  `valid_from` datetime NOT NULL,
  `valid_to` datetime NOT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `per_user_limit` int(11) DEFAULT NULL,
  `status` enum('active','expired','disabled') DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`coupon_id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount_value`, `valid_from`, `valid_to`, `usage_limit`, `per_user_limit`, `status`, `created_at`, `updated_at`) VALUES
(1, 'NEWYEAR2025', 'percent', 15.00, 200000.00, 50000.00, '2025-12-20 00:00:00', '2026-01-05 00:00:00', 500, 2, 'active', '2025-11-07 01:30:48', '2026-01-25 09:07:20'),
(2, 'FREESHIP50', 'amount', 50000.00, 100000.00, NULL, '2025-11-01 00:00:00', '2025-12-31 00:00:00', 1000, 3, 'active', '2025-11-07 01:30:48', '2026-01-25 09:07:42'),
(3, 'WELCOME10', 'percent', 10.00, 0.00, NULL, '2025-01-01 00:00:00', '2025-12-31 00:00:00', 10000, 1, 'disabled', '2025-11-07 01:30:48', '2026-01-16 07:35:36'),
(4, 'VIPMEMBER', 'amount', 100000.00, 500000.00, NULL, '2025-05-01 00:00:00', '2026-05-01 00:00:00', 100, 5, 'active', '2025-11-07 01:30:48', '2025-11-07 01:30:48'),
(5, 'SUMMERSALE', 'percent', 20.00, 300000.00, 80000.00, '2025-06-01 00:00:00', '2025-08-31 00:00:00', 2000, 2, 'active', '2025-11-07 01:30:48', '2026-01-16 07:35:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `customer_coupons`
--

CREATE TABLE `customer_coupons` (
  `customer_id` int(11) NOT NULL,
  `coupon_id` int(11) NOT NULL,
  `times_used` int(11) DEFAULT 0,
  `last_used_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_coupons`
--

INSERT INTO `customer_coupons` (`customer_id`, `coupon_id`, `times_used`, `last_used_at`) VALUES
(1, 1, 1, '2025-12-25 00:00:00'),
(1, 2, 0, NULL),
(1, 4, 0, NULL),
(2, 1, 1, '2025-02-10 00:00:00'),
(4, 5, 2, '2025-07-15 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer_coupons`
--
ALTER TABLE `customer_coupons`
  ADD PRIMARY KEY (`customer_id`,`coupon_id`),
  ADD KEY `fk_cc_coupon` (`coupon_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_coupons`
--
ALTER TABLE `customer_coupons`
  ADD CONSTRAINT `fk_cc_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cc_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `email`, `address`, `created_at`, `username`, `password`, `first_name`, `last_name`) VALUES
(1, 'nguyentrungtin1002@gmail.com', 'Hanoi', '2025-11-06 18:22:42', 'nguyentrungtin2001@gmail.com', '09004092001', 'Nguyen Trung', 'Tin'),
(2, 'nguyentrunghieu0102@gmail.com', 'Ho Chi Minh', '2025-11-06 18:22:42', 'nguyentrunghieu2010@gmail.com', '09019012010', 'Nguyen Trung', 'Hieu'),
(3, 'tranbichngoc22112001@gmail.com', 'Phu Yen', '2025-11-06 18:22:42', 'tranbichngoc2001@gmail.com', '09022112001', 'Tran Bich', 'Ngoc'),
(4, 'maithianhnguyet22111977@gmail.com', 'Can Tho', '2025-11-06 18:22:42', 'maithianhnguyet1977@gmail.com', '09022111977', 'Mai Thi Anh', 'Nguyet'),
(5, 'nguyenvantu1975@gmail.com', 'Hue', '2025-11-06 18:22:42', 'nguyenvantu1975@gmail.com', '', 'Nguyen Van', 'Tu'),
(6, 'nguyenvanminh2001@gmail.com', '558/1/16 Binh Quoi Street', '2024-01-05 03:15:00', 'nguyenvanminh2001@gmail.com', '09004092001', 'Nguyen Van', 'Minh'),
(7, 'nguyenvantoan2001@gmail.com', 'Binh Thanh', '2024-01-05 03:15:00', 'nguyenvantoan2001@gmail.com', '09004092001', 'Nguyen Van', 'Toan'),
(11, 'nguyenvanlan2001@gmail.com', 'Binh Thanh', '2024-01-05 03:15:00', 'nguyenvanlan2001@gmail.com', '09004092001', 'Nguyen Van', 'Lan'),
(12, 'tranminhtoan2001@gmail.com', 'Binh Thanh', '0000-00-00 00:00:00', 'tranminhtoan2001@gmail.com', '09004092001', 'Tran Minh', 'Toan'),
(14, 'tranminhphong2001@gmail.com', 'Binh Thanh', '2025-11-24 01:24:28', 'tranminhphong2001@gmail.com', '09004092001', 'Tran Minh', 'Phong');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `product_sku` varchar(100) NOT NULL,
  `quantity_storage` int(11) NOT NULL DEFAULT 0,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `warehouse_id`, `product_sku`, `quantity_storage`, `updated_at`) VALUES
(1, 2, '3 Day WKND', 194, '2025-11-30 17:38:51'),
(2, 4, 'Amber And Vanilla', 75, '2025-11-30 07:27:49'),
(3, 5, 'Coconut And Sea Salt', 130, '2025-11-30 07:27:49'),
(4, 2, 'Day Party', 131, '2025-11-30 07:27:49'),
(5, 5, 'Jasmin ylang ylang sandalwood', 183, '2025-11-30 07:27:49'),
(6, 5, 'Lavander Vanilia', 160, '2025-11-30 07:27:49'),
(7, 1, 'Milk Vanilla', 198, '2025-11-30 07:27:49'),
(8, 5, 'Sandalwood And Rose', 198, '2025-11-30 07:27:49'),
(9, 2, 'Shower Playlist', 106, '2025-11-30 07:27:49'),
(10, 5, 'Smells Like Cacao And Vanilla', 100, '2025-11-30 07:27:49'),
(11, 1, 'Sunset Disco', 126, '2025-11-30 07:27:49'),
(12, 1, 'Warn Cider And Cinamon', 72, '2025-11-30 07:27:49'),
(13, 5, 'Lumos Honeydrew And Coconut', 55, '2025-11-30 07:27:49'),
(14, 3, 'Lumos Tropical Orchard', 113, '2025-11-30 07:27:49'),
(15, 3, 'Lumos Rose Boutique', 111, '2025-11-30 07:27:49'),
(16, 4, 'Lumos Lemongrass', 69, '2025-11-30 07:27:49'),
(17, 2, 'Lumos Cajeput', 58, '2025-11-30 07:27:49'),
(18, 4, 'Lumos menthol', 120, '2025-11-30 07:27:49'),
(19, 1, 'Lumos cold', 127, '2025-11-30 07:27:49'),
(20, 5, 'Lumos And Cucumber', 56, '2025-11-30 07:27:49'),
(21, 1, 'Lumos Juicy Peach', 157, '2025-11-30 07:27:49'),
(22, 4, 'Lumos Midnight sandalwood', 136, '2025-11-30 07:27:49'),
(23, 5, 'YOU ARE THE MAGIC', 50, '2025-11-30 07:27:49'),
(24, 1, 'BLOW A WISH', 164, '2025-11-30 07:27:49'),
(25, 2, 'Candle Tray', 137, '2025-11-30 07:27:49'),
(26, 2, 'Candle Snuffer', 182, '2025-11-30 07:27:49'),
(27, 2, 'Candle Scissor', 137, '2025-11-30 07:27:49'),
(28, 4, 'Candle matchbox', 50, '2025-11-30 07:27:49'),
(29, 5, 'Candle rotation tray', 95, '2025-11-30 07:27:49'),
(30, 3, 'Candle pinwheel', 54, '2025-11-30 07:27:49'),
(31, 4, 'Candle metal tray', 77, '2025-11-30 07:27:49'),
(32, 3, 'Candle holder', 74, '2025-11-30 07:27:49'),
(33, 3, 'Wood tray', 102, '2025-11-30 07:27:49'),
(34, 1, 'Nen_and_Hoa', 143, '2025-11-30 07:27:49'),
(35, 4, 'Dalat Gift', 62, '2025-11-30 07:27:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `fk_inventory_warehouse` (`warehouse_id`),
  ADD KEY `idx_inventory_sku` (`product_sku`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `fk_inventory_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `ware_houses` (`warehouse_id`) ON UPDATE CASCADE;
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `order_coupons`
--

CREATE TABLE `order_coupons` (
  `order_id` int(11) NOT NULL,
  `coupon_id` int(11) NOT NULL,
  `discount_applied` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_coupons`
--

INSERT INTO `order_coupons` (`order_id`, `coupon_id`, `discount_applied`) VALUES
(1, 1, 35000.00),
(2, 2, 50000.00),
(2, 4, 100000.00),
(3, 1, 89000.00),
(5, 5, 20000.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order_coupons`
--
ALTER TABLE `order_coupons`
  ADD PRIMARY KEY (`order_id`,`coupon_id`),
  ADD KEY `fk_oc_coupon` (`coupon_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_coupons`
--
ALTER TABLE `order_coupons`
  ADD CONSTRAINT `fk_oc_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_oc_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `order_details_inventory`
--

CREATE TABLE `order_details_inventory` (
  `order_detail_id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `allocated_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details_inventory`
--

INSERT INTO `order_details_inventory` (`order_detail_id`, `inventory_id`, `allocated_quantity`) VALUES
(3, 30, 45);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order_details_inventory`
--
ALTER TABLE `order_details_inventory`
  ADD PRIMARY KEY (`order_detail_id`,`inventory_id`),
  ADD KEY `inventory_id` (`inventory_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_details_inventory`
--
ALTER TABLE `order_details_inventory`
  ADD CONSTRAINT `order_details_inventory_ibfk_1` FOREIGN KEY (`order_detail_id`) REFERENCES `order_details` (`order_detail_id`),
  ADD CONSTRAINT `order_details_inventory_ibfk_2` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`);
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `order_detail_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`order_detail_id`, `order_id`, `quantity`) VALUES
(1, 1, 2),
(2, 3, 1),
(3, 2, 5),
(4, 1, 3),
(5, 5, 1),
(6, 9, 5),
(7, 9, 1),
(8, 10, 1),
(9, 10, 1),
(10, 10, 6),
(11, 11, 1),
(12, 11, 1),
(13, 12, 9),
(14, 12, 9),
(15, 12, 2),
(16, 12, 1),
(17, 12, 1),
(18, 13, 9),
(19, 14, 9),
(20, 14, 1),
(21, 14, 9),
(22, 15, 1),
(23, 15, 9),
(24, 16, 1),
(25, 16, 9),
(26, 16, 5),
(27, 17, 9),
(28, 17, 1),
(29, 18, 9),
(30, 18, 1),
(31, 19, 1),
(32, 19, 9),
(33, 19, 2),
(34, 19, 1),
(35, 20, 1),
(36, 20, 9),
(37, 21, 1),
(38, 21, 9),
(39, 22, 1),
(40, 22, 9),
(41, 23, 1),
(42, 23, 9),
(43, 24, 1),
(44, 24, 9),
(45, 24, 1),
(46, 25, 1),
(47, 25, 9),
(48, 25, 9),
(49, 26, 1),
(50, 26, 9),
(51, 26, 1),
(52, 26, 1),
(53, 27, 1),
(54, 27, 9),
(55, 28, 1),
(56, 28, 9),
(57, 29, 1),
(58, 29, 9),
(59, 30, 1),
(60, 30, 9),
(61, 31, 1),
(62, 31, 9),
(63, 32, 1),
(64, 32, 9),
(65, 32, 1),
(66, 32, 9),
(67, 33, 1),
(68, 33, 1),
(69, 34, 1),
(70, 34, 9),
(71, 34, 1),
(72, 35, 5),
(73, 35, 1),
(74, 36, 1),
(75, 36, 9),
(76, 37, 1),
(77, 37, 9),
(78, 37, 1),
(79, 38, 1),
(80, 38, 9),
(81, 39, 1),
(82, 39, 9),
(83, 40, 1),
(84, 40, 9),
(85, 40, 1),
(86, 41, 1),
(87, 41, 7),
(88, 41, 1),
(89, 42, 1),
(90, 42, 9),
(91, 42, 1),
(92, 43, 1),
(93, 43, 9),
(94, 44, 9),
(95, 44, 1),
(96, 45, 1),
(97, 45, 9),
(98, 45, 1),
(99, 46, 1),
(100, 46, 9),
(101, 46, 1),
(102, 46, 9),
(103, 47, 1),
(104, 47, 9),
(105, 48, 9),
(106, 48, 5),
(107, 48, 1),
(108, 49, 1),
(109, 49, 9),
(110, 50, 1),
(111, 50, 9),
(112, 50, 1),
(113, 50, 9),
(114, 51, 1),
(115, 51, 1),
(116, 52, 1),
(117, 52, 1),
(118, 53, 1),
(119, 53, 9),
(120, 54, 1),
(121, 54, 9),
(122, 55, 1),
(123, 55, 9),
(124, 56, 1),
(125, 56, 9),
(126, 57, 1),
(127, 57, 9),
(128, 57, 1),
(129, 58, 1),
(130, 58, 9),
(131, 58, 1),
(132, 59, 9),
(133, 59, 5),
(134, 60, 1),
(135, 60, 9),
(136, 61, 1),
(137, 61, 9),
(138, 62, 1),
(139, 62, 9),
(140, 63, 1),
(141, 63, 9),
(142, 64, 1),
(143, 64, 9),
(144, 65, 1),
(145, 65, 9),
(146, 66, 1),
(147, 66, 9),
(148, 67, 1),
(149, 67, 9),
(150, 68, 1),
(151, 68, 9),
(152, 69, 1),
(153, 69, 9),
(154, 70, 1),
(155, 70, 9),
(156, 71, 1),
(157, 71, 9),
(158, 72, 1),
(159, 72, 9),
(160, 73, 1),
(161, 73, 9),
(162, 74, 1),
(163, 74, 9),
(164, 75, 1),
(165, 75, 9),
(166, 76, 1),
(167, 76, 9),
(168, 76, 5),
(169, 76, 1),
(170, 76, 1),
(171, 76, 1),
(172, 76, 6),
(173, 76, 1),
(174, 76, 1),
(175, 77, 1),
(176, 77, 9),
(177, 78, 1),
(178, 78, 9),
(179, 79, 1),
(180, 79, 1),
(181, 80, 1),
(182, 80, 7),
(183, 80, 1),
(184, 81, 1),
(185, 81, 9),
(186, 82, 1),
(187, 82, 9),
(188, 82, 1),
(189, 83, 1),
(190, 83, 9),
(191, 83, 1),
(192, 83, 9),
(193, 84, 1),
(194, 84, 9),
(195, 84, 1),
(196, 85, 1),
(197, 85, 9),
(198, 86, 1),
(199, 86, 9),
(200, 87, 1),
(201, 87, 9),
(202, 87, 1),
(203, 87, 5),
(204, 88, 9),
(205, 88, 1),
(206, 89, 1),
(207, 89, 9),
(208, 90, 1),
(209, 90, 9),
(210, 91, 1),
(211, 91, 9),
(212, 92, 1),
(213, 92, 9),
(214, 93, 1),
(215, 93, 9),
(216, 94, 1),
(217, 94, 9),
(218, 95, 1),
(219, 95, 9);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`order_detail_id`),
  ADD KEY `order_id` (`order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `order_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=220;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(12,2) NOT NULL,
  `status_order` enum('pending','processing','shipped','completed','cancelled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `order_date`, `total_amount`, `status_order`) VALUES
(1, 1, '2025-11-07 01:31:36', 350000.00, 'shipped'),
(2, 2, '2025-11-07 01:31:36', 150000.00, 'pending'),
(3, 1, '2025-11-07 01:31:36', 890000.00, 'shipped'),
(5, 2, '2025-11-07 01:31:36', 100000.00, 'cancelled'),
(9, 1, '2025-12-01 00:09:50', 1896.00, 'processing'),
(10, 1, '2025-12-01 00:27:03', 612.00, 'pending'),
(11, 4, '2025-12-01 00:42:30', 678.00, 'processing'),
(12, 1, '2025-12-01 00:58:08', 1872.00, 'processing'),
(13, 1, '2025-12-01 01:00:33', 918.00, 'processing'),
(14, 1, '2025-12-01 15:17:08', 2412.00, 'processing'),
(15, 1, '2025-12-13 13:14:50', 930.00, 'processing'),
(16, 1, '2025-12-13 13:17:01', 3294.00, 'processing'),
(17, 1, '2025-12-14 10:08:42', 1494.00, 'processing'),
(18, 1, '2025-12-14 16:29:14', 1494.00, 'processing'),
(19, 1, '2025-12-14 16:32:09', 57.23, 'processing'),
(20, 1, '2025-12-14 16:33:34', 35.34, 'processing'),
(21, 1, '2025-12-14 17:26:21', 930.00, 'processing'),
(22, 1, '2025-12-14 17:27:03', 35.34, 'processing'),
(23, 1, '2025-12-14 17:30:09', 35.34, 'processing'),
(24, 1, '2025-12-14 18:10:44', 57.23, 'processing'),
(25, 1, '2025-12-14 18:12:00', 70.22, 'processing'),
(26, 1, '2025-12-14 18:18:12', 39.44, 'processing'),
(27, 1, '2025-12-14 21:47:57', 35.34, 'processing'),
(28, 1, '2025-12-14 21:50:28', 56.77, 'processing'),
(29, 1, '2025-12-14 21:53:28', 56.77, 'processing'),
(30, 1, '2025-12-14 21:55:05', 35.34, 'processing'),
(31, 1, '2025-12-14 21:59:51', 35.34, 'processing'),
(32, 1, '2025-12-16 22:17:34', 92.11, 'processing'),
(33, 1, '2025-12-16 22:27:58', 22.34, 'processing'),
(34, 1, '2025-12-16 22:29:47', 57.23, 'processing'),
(35, 1, '2025-12-16 22:32:08', 68.86, 'processing'),
(36, 1, '2025-12-16 22:35:11', 35.34, 'processing'),
(37, 1, '2025-12-16 23:06:29', 57.23, 'processing'),
(38, 1, '2025-12-16 23:08:11', 35.34, 'processing'),
(39, 1, '2025-12-16 23:09:13', 930.00, 'processing'),
(40, 1, '2025-12-16 23:11:01', 48.19, 'processing'),
(41, 4, '2025-12-16 23:54:20', 103.94, 'processing'),
(42, 1, '2025-12-17 00:04:46', 57.47, 'processing'),
(43, 1, '2025-12-17 00:06:39', 35.48, 'processing'),
(44, 1, '2025-12-17 00:12:54', 35.48, 'processing'),
(45, 1, '2025-12-17 08:03:05', 57.42, 'processing'),
(46, 1, '2025-12-17 15:57:19', 92.42, 'processing'),
(47, 1, '2025-12-20 12:58:23', 35.44, 'processing'),
(48, 1, '2025-12-20 13:01:40', 104.04, 'processing'),
(49, 1, '2025-12-23 09:19:44', 930.00, 'processing'),
(50, 1, '2025-12-23 09:20:41', 2424.00, 'processing'),
(51, 4, '2025-12-25 01:57:22', 678.00, 'processing'),
(52, 4, '2025-12-25 23:59:41', 678.00, 'processing'),
(53, 1, '2025-12-26 00:04:25', 930.00, 'processing'),
(54, 1, '2025-12-28 12:10:58', 930.00, 'processing'),
(55, 1, '2025-12-28 12:12:14', 35.48, 'processing'),
(56, 1, '2025-12-28 14:31:35', 930.00, 'processing'),
(57, 1, '2025-12-28 16:37:25', 1506.00, 'processing'),
(58, 1, '2025-12-28 16:43:52', 1506.00, 'processing'),
(59, 1, '2025-12-28 16:46:02', 2718.00, 'processing'),
(60, 1, '2025-12-28 18:13:23', 930.00, 'processing'),
(61, 1, '2025-12-28 18:13:24', 930.00, 'processing'),
(62, 1, '2025-12-28 18:13:26', 930.00, 'processing'),
(63, 1, '2025-12-28 18:13:27', 930.00, 'processing'),
(64, 1, '2025-12-28 18:13:29', 930.00, 'processing'),
(65, 1, '2025-12-28 18:13:32', 930.00, 'processing'),
(66, 1, '2025-12-28 18:14:11', 930.00, 'processing'),
(67, 1, '2025-12-28 18:14:12', 930.00, 'processing'),
(68, 1, '2025-12-28 18:14:17', 930.00, 'processing'),
(69, 1, '2025-12-28 18:14:19', 930.00, 'processing'),
(70, 1, '2025-12-28 18:14:49', 930.00, 'processing'),
(71, 1, '2025-12-28 18:14:50', 930.00, 'processing'),
(72, 1, '2025-12-28 18:14:53', 930.00, 'processing'),
(73, 1, '2025-12-28 18:14:56', 930.00, 'processing'),
(74, 1, '2025-12-28 18:18:37', 930.00, 'processing'),
(75, 1, '2025-12-28 18:18:38', 930.00, 'processing'),
(76, 1, '2025-12-28 18:23:45', 4590.00, 'processing'),
(77, 1, '2025-12-28 19:19:55', 35.48, 'processing'),
(78, 1, '2025-12-28 19:36:39', 35.48, 'processing'),
(79, 4, '2025-12-28 20:15:51', 25.87, 'processing'),
(80, 4, '2025-12-28 20:16:50', 3198.00, 'completed'),
(81, 1, '2025-12-28 20:19:46', 930.00, 'processing'),
(82, 1, '2025-12-28 20:20:34', 57.47, 'processing'),
(83, 1, '2025-12-28 20:21:40', 2424.00, 'processing'),
(84, 1, '2026-01-06 06:55:05', 1506.00, 'processing'),
(85, 1, '2026-01-06 06:56:26', 930.00, 'processing'),
(86, 1, '2026-01-15 08:24:08', 930.00, 'processing'),
(87, 1, '2026-01-15 08:50:20', 126.19, 'processing'),
(88, 1, '2026-01-17 15:35:02', 1494.00, 'completed'),
(89, 1, '2026-01-17 20:44:40', 35.46, 'processing'),
(90, 1, '2026-01-18 16:43:05', 35.50, 'processing'),
(91, 1, '2026-01-18 16:56:02', 35.50, 'processing'),
(92, 1, '2026-01-18 16:59:31', 35.50, 'processing'),
(93, 1, '2026-01-25 19:46:41', 930.00, 'processing'),
(94, 1, '2026-01-25 19:54:02', 930.00, 'processing'),
(95, 1, '2026-01-25 20:23:03', 930.00, 'processing');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_orders_customer` (`customer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON UPDATE CASCADE;
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `method` enum('cash','paypal','vnpay','momo') NOT NULL,
  `payment_gateway_id` varchar(255) DEFAULT NULL,
  `status_payment` enum('pending','success','failed','refund') DEFAULT 'pending',
  `payment_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `method`, `payment_gateway_id`, `status_payment`, `payment_date`) VALUES
(1, 1, 'cash', 'Undefine by Cash', 'success', '2025-11-07 01:35:39'),
(2, 2, 'cash', 'Undefine by Cash', 'success', '2025-11-07 01:35:39'),
(3, 3, 'cash', 'Undefine by Cash', 'success', '2025-11-07 01:35:39'),
(5, 5, 'cash', 'Undefine by Cash', 'success', '2025-11-07 01:35:39'),
(7, 9, 'cash', 'Undefine by Cash', 'success', '2025-12-01 00:09:50'),
(8, 10, 'cash', 'Undefine by Cash', 'success', '2025-12-01 00:27:03'),
(9, 11, 'cash', 'Undefine by Cash', 'success', '2025-12-01 00:42:30'),
(10, 12, 'cash', 'Undefine by Cash', 'success', '2025-12-01 00:58:08'),
(11, 13, 'cash', 'Undefine by Cash', 'success', '2025-12-01 01:00:33'),
(12, 14, 'cash', 'Undefine by Cash', 'success', '2025-12-01 15:17:08'),
(13, 15, 'cash', 'Undefine by Cash', 'success', '2025-12-13 13:14:50'),
(14, 16, 'cash', 'Undefine by Cash', 'success', '2025-12-13 13:17:01'),
(15, 17, 'cash', 'Undefine by Cash', 'success', '2025-12-14 10:08:42'),
(16, 18, 'cash', 'Undefine by Cash', 'success', '2025-12-14 16:29:14'),
(17, 19, 'cash', 'Undefine by Cash', 'success', '2025-12-14 16:32:09'),
(18, 20, 'cash', 'Undefine by Cash', 'success', '2025-12-14 16:33:34'),
(19, 21, 'cash', 'Undefine by Cash', 'success', '2025-12-14 17:26:21'),
(20, 22, 'cash', 'Undefine by Cash', 'success', '2025-12-14 17:27:03'),
(21, 23, 'cash', 'Undefine by Cash', 'success', '2025-12-14 17:30:10'),
(22, 24, 'cash', 'Undefine by Cash', 'success', '2025-12-14 18:10:44'),
(23, 25, 'cash', 'Undefine by Cash', 'success', '2025-12-14 18:12:00'),
(24, 26, 'cash', 'Undefine by Cash', 'success', '2025-12-14 18:18:12'),
(25, 27, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:47:57'),
(26, 28, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:50:28'),
(27, 29, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:53:28'),
(28, 30, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:55:05'),
(29, 31, 'cash', 'Undefine by Cash', 'success', '2025-12-14 21:59:51'),
(30, 32, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:17:34'),
(31, 33, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:27:58'),
(32, 34, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:29:47'),
(33, 35, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:32:08'),
(34, 36, 'cash', 'Undefine by Cash', 'success', '2025-12-16 22:35:11'),
(35, 37, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:06:29'),
(36, 38, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:08:11'),
(37, 39, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:09:13'),
(38, 40, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:11:01'),
(39, 41, 'cash', 'Undefine by Cash', 'success', '2025-12-16 23:54:20'),
(40, 42, 'cash', 'Undefine by Cash', 'success', '2025-12-17 00:04:46'),
(41, 43, 'cash', 'Undefine by Cash', 'success', '2025-12-17 00:06:39'),
(42, 44, 'cash', 'Undefine by Cash', 'success', '2025-12-17 00:12:54'),
(43, 45, 'cash', 'Undefine by Cash', 'success', '2025-12-17 08:03:05'),
(44, 46, 'cash', 'Undefine by Cash', 'success', '2025-12-17 15:57:19'),
(45, 47, 'cash', 'Undefine by Cash', 'success', '2025-12-20 12:58:23'),
(46, 48, 'cash', 'Undefine by Cash', 'success', '2025-12-20 13:01:40'),
(47, 49, 'cash', 'Undefine by Cash', 'success', '2025-12-23 09:19:44'),
(48, 50, 'cash', 'Undefine by Cash', 'success', '2025-12-23 09:20:41'),
(49, 51, 'cash', 'Undefine by Cash', 'success', '2025-12-25 01:57:22'),
(50, 52, 'cash', 'Undefine by Cash', 'success', '2025-12-25 23:59:41'),
(51, 53, 'cash', 'Undefine by Cash', 'success', '2025-12-26 00:04:25'),
(52, 54, 'cash', 'Undefine by Cash', 'success', '2025-12-28 12:10:58'),
(53, 55, 'cash', 'Undefine by Cash', 'success', '2025-12-28 12:12:14'),
(54, 56, 'cash', 'Undefine by Cash', 'success', '2025-12-28 14:31:35'),
(55, 57, 'cash', 'Undefine by Cash', 'success', '2025-12-28 16:37:25'),
(56, 58, 'cash', 'Undefine by Cash', 'success', '2025-12-28 16:43:52'),
(57, 59, 'cash', 'Undefine by Cash', 'success', '2025-12-28 16:46:02'),
(58, 60, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:23'),
(59, 61, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:24'),
(60, 62, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:26'),
(61, 63, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:27'),
(62, 64, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:29'),
(63, 65, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:13:32'),
(64, 66, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:11'),
(65, 67, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:12'),
(66, 68, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:17'),
(67, 69, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:19'),
(68, 70, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:49'),
(69, 71, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:50'),
(70, 72, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:53'),
(71, 73, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:14:56'),
(72, 74, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:18:37'),
(73, 75, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:18:38'),
(74, 76, 'cash', 'Undefine by Cash', 'success', '2025-12-28 18:23:45'),
(75, 77, 'cash', 'Undefine by Cash', 'success', '2025-12-28 19:19:55'),
(76, 78, 'paypal', '6UD11051JE873780N', 'success', '2025-12-28 19:36:39'),
(77, 79, 'paypal', '428323611R377405B', 'success', '2025-12-28 20:15:51'),
(78, 80, 'cash', 'Undefine by Cash', 'success', '2025-12-28 20:16:50'),
(79, 81, 'cash', 'Undefine by Cash', 'success', '2025-12-28 20:19:46'),
(80, 82, 'paypal', '2ES06100XA0939833', 'success', '2025-12-28 20:20:34'),
(81, 83, 'vnpay', '28202103', 'success', '2025-12-28 20:21:40'),
(82, 84, 'cash', 'Undefine by Cash', 'success', '2026-01-06 06:55:05'),
(83, 85, 'cash', 'Undefine by Cash', 'success', '2026-01-06 06:56:26'),
(84, 86, 'cash', 'Undefine by Cash', 'pending', '2026-01-15 08:24:08'),
(85, 87, 'paypal', '51W72818AG839343J', 'pending', '2026-01-15 08:50:20'),
(86, 88, 'cash', 'Undefine by Cash', 'pending', '2026-01-17 15:35:02'),
(87, 89, 'paypal', '9JD69701WX538660N', 'pending', '2026-01-17 20:44:40'),
(88, 90, 'paypal', '1CS20671NL340402F', 'pending', '2026-01-18 16:43:05'),
(89, 91, 'paypal', '6MD83973Y0407434M', 'pending', '2026-01-18 16:56:02'),
(90, 92, 'paypal', '0R9228755V178211T', 'pending', '2026-01-18 16:59:31'),
(91, 93, 'vnpay', '25195017', 'pending', '2026-01-25 19:46:41'),
(92, 94, 'vnpay', '25195314', 'pending', '2026-01-25 19:54:02'),
(93, 95, 'vnpay', '25202215', 'pending', '2026-01-25 20:23:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `uq_payments_order` (`order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `personal_shopping_bag`
--

CREATE TABLE `personal_shopping_bag` (
  `bag_item_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `candle_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price_unit` decimal(10,2) DEFAULT NULL,
  `candle_image` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_shopping_bag`
--

INSERT INTO `personal_shopping_bag` (`bag_item_id`, `customer_id`, `candle_name`, `quantity`, `price_unit`, `candle_image`) VALUES
(1, 1, 'Candle matchbox', 1, 10.00, '../../../../assets/img/Automation/Image/28.jpg'),
(2, 1, 'Candle Snuffer', 9, 85.00, '../../../../assets/img/Automation/Image/26.jpg'),
(3, 1, 'Lumos Honeydrew And Coconut', 1, 480.00, '../../../../assets/img/Automation/Image/13.jpg'),
(4, 3, 'BLOW A WISH', 10, 315.00, '../../../../assets/img/Automation/Image/24.jpg'),
(5, 3, 'Warn Cider And Cinamon', 4, 450.00, '../../../../assets/img/Automation/Image/12.jpg'),
(6, 4, 'Rose Garden Candle', 2, 18.20, 'images/candles/rose_garden.jpg'),
(7, 5, 'Jasmine Night Candle', 1, 13.90, 'images/candles/jasmine_night.jpg'),
(8, 5, 'Coffee Aroma Candle', 2, 11.50, 'images/candles/coffee_aroma.jpg'),
(9, 1, 'Candle Snuffer', 9, 85.00, '../../../../assets/img/Automation/Image/26.jpg'),
(10, 1, '3 Day WKND', 5, 300.00, '../../../../assets/img/Automation/Image/1.jpg'),
(14, 2, 'Candle Scissor', 7, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(15, 2, '3 Day WKND', 5, 300.00, '../../../../assets/img/Automation/Image/1.jpg'),
(16, 2, 'Candle matchbox', 8, 10.00, '../../../../assets/img/Automation/Image/28.jpg'),
(17, 2, 'Lumos Rose Boutique', 1, 480.00, '../../../../assets/img/Automation/Image/15.jpg'),
(18, 2, 'Lumos Lemongrass', 1, 255.00, '../../../../assets/img/Automation/Image/16.jpg'),
(21, 1, 'Lavender Breeze Candle2', 2, 12.99, 'images/candles/lavender_breeze.jpg'),
(22, 1, 'Candle matchbox', 1, 10.00, '../../../../assets/img/Automation/Image/28.jpg'),
(23, 1, 'Candle matchbox', 1, 10.00, '../../../../assets/img/Automation/Image/28.jpg'),
(24, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(25, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(26, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(27, 1, 'Wood tray', 1, 20.00, '../../../../assets/img/Automation/Image/33.jpg'),
(28, 1, 'Candle pinwheel', 1, 90.00, '../../../../assets/img/Automation/Image/30.jpg'),
(29, 1, 'Candle Tray', 6, 80.00, '../../../../assets/img/Automation/Image/25.jpg'),
(30, 1, 'Lumos Honeydrew And Coconut', 1, 480.00, '../../../../assets/img/Automation/Image/13.jpg'),
(31, 1, 'Lumos Honeydrew And Coconut', 1, 480.00, '../../../../assets/img/Automation/Image/13.jpg'),
(32, 1, 'Lumos Honeydrew And Coconut', 1, 480.00, '../../../../assets/img/Automation/Image/13.jpg'),
(33, 12, 'Candle holder', 7, 90.00, '../../../../assets/img/Automation/Image/32.jpg'),
(34, 12, '3 Day WKND', 1, 300.00, '../../../../assets/img/Automation/Image/1.jpg'),
(35, 12, 'Day Party', 1, 150.00, '../../../../assets/img/Automation/Image/4.jpg'),
(36, 12, 'Amber And Vanilla', 1, 400.00, '../../../../assets/img/Automation/Image/2.jpg'),
(37, 12, '3 Day WKND', 1, 300.00, '../../../../assets/img/Automation/Image/1.jpg'),
(38, 1, 'Amber And Vanilla', 1, 400.00, '../../../../assets/img/Automation/Image/2.jpg'),
(39, 1, 'Wood tray', 1, 20.00, '../../../../assets/img/Automation/Image/33.jpg'),
(40, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(41, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg'),
(42, 1, 'Candle Scissor', 1, 80.00, '../../../../assets/img/Automation/Image/27.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  ADD PRIMARY KEY (`bag_item_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  MODIFY `bag_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  ADD CONSTRAINT `personal_shopping_bag_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `phone`
--

CREATE TABLE `phone` (
  `customer_id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `phone`
--

INSERT INTO `phone` (`customer_id`, `phone`) VALUES
(1, '0826780002'),
(1, '0931950826'),
(2, '0901234567'),
(2, '0912345678'),
(3, '0826780002'),
(3, '0906937424'),
(3, '0931950826'),
(5, '0906054449');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `phone`
--
ALTER TABLE `phone`
  ADD PRIMARY KEY (`customer_id`,`phone`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `phone`
--
ALTER TABLE `phone`
  ADD CONSTRAINT `phone_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `ware_houses`
--

CREATE TABLE `ware_houses` (
  `warehouse_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `manager_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ware_houses`
--

INSERT INTO `ware_houses` (`warehouse_id`, `name`, `location`, `capacity`, `manager_name`) VALUES
(1, 'Warehouse North', 'Hanoi', 100, 'Nguyen Trung Tin'),
(2, 'Warehouse South', 'HCM', 140, 'Tran Bich Ngoc'),
(3, 'Warehouse Central', 'Da Nang', 60, 'Nguyen Trung Hieu'),
(4, 'Warehouse West', 'Can Tho', 200, 'Mai Thi Anh Nguyet'),
(5, 'Warehouse Backup', 'Hue', 340, 'Nguyen Van Tu');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ware_houses`
--
ALTER TABLE `ware_houses`
  ADD PRIMARY KEY (`warehouse_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ware_houses`
--
ALTER TABLE `ware_houses`
  MODIFY `warehouse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;