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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


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
(8, 'nguyenvanlan2001@gmail.com', 'Binh Thanh', '2026-03-19 16:50:20', 'nguyenvanlan2001@gmail.com', '09004092001', 'Nguyen Van', 'Lan'),
(9, 'tranminhtoan2001@gmail.com', 'Binh Thanh', '2026-03-19 16:50:28', 'tranminhtoan2001@gmail.com', '09004092001', 'Tran Minh', 'Toan'),
(10, 'tranminhphong2001@gmail.com', 'Binh Thanh', '2026-03-19 16:50:36', 'tranminhphong2001@gmail.com', '09004092001', 'Tran Minh', 'Phong');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `quantity_storage` int(11) NOT NULL DEFAULT 0,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `warehouse_id`, `quantity_storage`, `updated_at`, `product_id`) VALUES
(104, 1, 117, '2026-03-19 23:48:08', 1),
(105, 2, 297, '2026-03-19 23:48:08', 1),
(106, 3, 182, '2026-03-19 23:48:08', 1),
(107, 4, 422, '2026-03-19 23:48:08', 1),
(108, 5, 160, '2026-03-19 23:48:08', 1),
(109, 1, 386, '2026-03-19 23:48:08', 2),
(110, 2, 50, '2026-03-19 23:48:08', 2),
(111, 3, 393, '2026-03-19 23:48:08', 2),
(112, 4, 413, '2026-03-19 23:48:08', 2),
(113, 5, 386, '2026-03-19 23:48:08', 2),
(114, 1, 191, '2026-03-19 23:48:08', 3),
(115, 2, 199, '2026-03-19 23:48:08', 3),
(116, 3, 373, '2026-03-19 23:48:08', 3),
(117, 4, 318, '2026-03-19 23:48:08', 3),
(118, 5, 418, '2026-03-19 23:48:08', 3),
(119, 1, 188, '2026-03-19 23:48:08', 4),
(120, 2, 85, '2026-03-19 23:48:08', 4),
(121, 3, 263, '2026-03-19 23:48:08', 4),
(122, 4, 109, '2026-03-19 23:48:08', 4),
(123, 5, 156, '2026-03-19 23:48:08', 4),
(124, 1, 405, '2026-03-19 23:48:08', 5),
(125, 2, 156, '2026-03-19 23:48:08', 5),
(126, 3, 415, '2026-03-19 23:48:08', 5),
(127, 4, 204, '2026-03-19 23:48:08', 5),
(128, 5, 178, '2026-03-19 23:48:08', 5),
(129, 1, 226, '2026-03-19 23:48:08', 6),
(130, 2, 97, '2026-03-19 23:48:08', 6),
(131, 3, 208, '2026-03-19 23:48:08', 6),
(132, 4, 251, '2026-03-19 23:48:08', 6),
(133, 5, 127, '2026-03-19 23:48:08', 6),
(134, 1, 285, '2026-03-19 23:48:08', 7),
(135, 2, 91, '2026-03-19 23:48:08', 7),
(136, 3, 454, '2026-03-19 23:48:08', 7),
(137, 4, 142, '2026-03-19 23:48:08', 7),
(138, 5, 200, '2026-03-19 23:48:08', 7),
(139, 1, 76, '2026-03-19 23:48:08', 8),
(140, 2, 180, '2026-03-19 23:48:08', 8),
(141, 3, 171, '2026-03-19 23:48:08', 8),
(142, 4, 266, '2026-03-19 23:48:08', 8),
(143, 5, 318, '2026-03-19 23:48:08', 8),
(144, 1, 288, '2026-03-19 23:48:08', 9),
(145, 2, 440, '2026-03-19 23:48:08', 9),
(146, 3, 383, '2026-03-19 23:48:08', 9),
(147, 4, 93, '2026-03-19 23:48:08', 9),
(148, 5, 169, '2026-03-19 23:48:08', 9),
(149, 1, 68, '2026-03-19 23:48:08', 10),
(150, 2, 233, '2026-03-19 23:48:08', 10),
(151, 3, 461, '2026-03-19 23:48:08', 10),
(152, 4, 203, '2026-03-19 23:48:08', 10),
(153, 5, 486, '2026-03-19 23:48:08', 10),
(154, 1, 419, '2026-03-19 23:48:08', 11),
(155, 2, 137, '2026-03-19 23:48:08', 11),
(156, 3, 279, '2026-03-19 23:48:08', 11),
(157, 4, 482, '2026-03-19 23:48:08', 11),
(158, 5, 171, '2026-03-19 23:48:08', 11),
(159, 1, 263, '2026-03-19 23:48:08', 12),
(160, 2, 301, '2026-03-19 23:48:08', 12),
(161, 3, 216, '2026-03-19 23:48:08', 12),
(162, 4, 126, '2026-03-19 23:48:08', 12),
(163, 5, 382, '2026-03-19 23:48:08', 12),
(164, 1, 132, '2026-03-19 23:48:08', 13),
(165, 2, 366, '2026-03-19 23:48:08', 13),
(166, 3, 484, '2026-03-19 23:48:08', 13),
(167, 4, 371, '2026-03-19 23:48:08', 13),
(168, 5, 353, '2026-03-19 23:48:08', 13),
(169, 1, 149, '2026-03-19 23:48:08', 14),
(170, 2, 90, '2026-03-19 23:48:08', 14),
(171, 3, 404, '2026-03-19 23:48:08', 14),
(172, 4, 348, '2026-03-19 23:48:08', 14),
(173, 5, 478, '2026-03-19 23:48:08', 14),
(174, 1, 395, '2026-03-19 23:48:08', 15),
(175, 2, 491, '2026-03-19 23:48:08', 15),
(176, 3, 320, '2026-03-19 23:48:08', 15),
(177, 4, 76, '2026-03-19 23:48:08', 15),
(178, 5, 271, '2026-03-19 23:48:08', 15),
(179, 1, 178, '2026-03-19 23:48:08', 16),
(180, 2, 477, '2026-03-19 23:48:08', 16),
(181, 3, 450, '2026-03-19 23:48:08', 16),
(182, 4, 319, '2026-03-19 23:48:08', 16),
(183, 5, 195, '2026-03-19 23:48:08', 16),
(184, 1, 417, '2026-03-19 23:48:08', 17),
(185, 2, 101, '2026-03-19 23:48:08', 17),
(186, 3, 105, '2026-03-19 23:48:08', 17),
(187, 4, 171, '2026-03-19 23:48:08', 17),
(188, 5, 490, '2026-03-19 23:48:08', 17),
(189, 1, 83, '2026-03-19 23:48:08', 18),
(190, 2, 251, '2026-03-19 23:48:08', 18),
(191, 3, 55, '2026-03-19 23:48:08', 18),
(192, 4, 373, '2026-03-19 23:48:08', 18),
(193, 5, 296, '2026-03-19 23:48:08', 18),
(194, 1, 313, '2026-03-19 23:48:08', 19),
(195, 2, 175, '2026-03-19 23:48:08', 19),
(196, 3, 339, '2026-03-19 23:48:08', 19),
(197, 4, 217, '2026-03-19 23:48:08', 19),
(198, 5, 472, '2026-03-19 23:48:08', 19),
(199, 1, 306, '2026-03-19 23:48:08', 20),
(200, 2, 62, '2026-03-19 23:48:08', 20),
(201, 3, 247, '2026-03-19 23:48:08', 20),
(202, 4, 97, '2026-03-19 23:48:08', 20),
(203, 5, 147, '2026-03-19 23:48:08', 20),
(204, 1, 393, '2026-03-19 23:48:08', 21),
(205, 2, 122, '2026-03-19 23:48:08', 21),
(206, 3, 284, '2026-03-19 23:48:08', 21),
(207, 4, 100, '2026-03-19 23:48:08', 21),
(208, 5, 53, '2026-03-19 23:48:08', 21),
(209, 1, 363, '2026-03-19 23:48:08', 22),
(210, 2, 255, '2026-03-19 23:48:08', 22),
(211, 3, 137, '2026-03-19 23:48:08', 22),
(212, 4, 321, '2026-03-19 23:48:08', 22),
(213, 5, 242, '2026-03-19 23:48:08', 22),
(214, 1, 198, '2026-03-19 23:48:08', 23),
(215, 2, 214, '2026-03-19 23:48:08', 23),
(216, 3, 425, '2026-03-19 23:48:08', 23),
(217, 4, 82, '2026-03-19 23:48:08', 23),
(218, 5, 437, '2026-03-19 23:48:08', 23),
(219, 1, 85, '2026-03-19 23:48:08', 24),
(220, 2, 420, '2026-03-19 23:48:08', 24),
(221, 3, 440, '2026-03-19 23:48:08', 24),
(222, 4, 442, '2026-03-19 23:48:08', 24),
(223, 5, 387, '2026-03-19 23:48:08', 24),
(224, 1, 111, '2026-03-19 23:48:08', 25),
(225, 2, 244, '2026-03-19 23:48:08', 25),
(226, 3, 389, '2026-03-19 23:48:08', 25),
(227, 4, 260, '2026-03-19 23:48:08', 25),
(228, 5, 85, '2026-03-19 23:48:08', 25),
(229, 1, 496, '2026-03-19 23:48:08', 26),
(230, 2, 374, '2026-03-19 23:48:08', 26),
(231, 3, 331, '2026-03-19 23:48:08', 26),
(232, 4, 484, '2026-03-19 23:48:08', 26),
(233, 5, 477, '2026-03-19 23:48:08', 26),
(234, 1, 433, '2026-03-19 23:48:08', 27),
(235, 2, 231, '2026-03-19 23:48:08', 27),
(236, 3, 258, '2026-03-19 23:48:08', 27),
(237, 4, 95, '2026-03-19 23:48:08', 27),
(238, 5, 105, '2026-03-19 23:48:08', 27),
(239, 1, 189, '2026-03-19 23:48:08', 28),
(240, 2, 131, '2026-03-19 23:48:08', 28),
(241, 3, 488, '2026-03-19 23:48:08', 28),
(242, 4, 196, '2026-03-19 23:48:08', 28),
(243, 5, 367, '2026-03-19 23:48:08', 28),
(244, 1, 297, '2026-03-19 23:48:08', 29),
(245, 2, 335, '2026-03-19 23:48:08', 29),
(246, 3, 282, '2026-03-19 23:48:08', 29),
(247, 4, 356, '2026-03-19 23:48:08', 29),
(248, 5, 435, '2026-03-19 23:48:08', 29),
(249, 1, 156, '2026-03-19 23:48:08', 30),
(250, 2, 325, '2026-03-19 23:48:08', 30),
(251, 3, 209, '2026-03-19 23:48:08', 30),
(252, 4, 468, '2026-03-19 23:48:08', 30),
(253, 5, 311, '2026-03-19 23:48:08', 30),
(254, 1, 100, '2026-03-19 23:48:08', 31),
(255, 2, 423, '2026-03-19 23:48:08', 31),
(256, 3, 410, '2026-03-19 23:48:08', 31),
(257, 4, 281, '2026-03-19 23:48:08', 31),
(258, 5, 124, '2026-03-19 23:48:08', 31),
(259, 1, 179, '2026-03-19 23:48:08', 32),
(260, 2, 472, '2026-03-19 23:48:08', 32),
(261, 3, 423, '2026-03-19 23:48:08', 32),
(262, 4, 199, '2026-03-19 23:48:08', 32),
(263, 5, 128, '2026-03-19 23:48:08', 32),
(264, 1, 443, '2026-03-19 23:48:08', 33),
(265, 2, 427, '2026-03-19 23:48:08', 33),
(266, 3, 307, '2026-03-19 23:48:08', 33),
(267, 4, 204, '2026-03-19 23:48:08', 33),
(268, 5, 50, '2026-03-19 23:48:08', 33),
(269, 1, 491, '2026-03-19 23:48:08', 34),
(270, 2, 452, '2026-03-19 23:48:08', 34),
(271, 3, 285, '2026-03-19 23:48:08', 34),
(272, 4, 469, '2026-03-19 23:48:08', 34),
(273, 5, 91, '2026-03-19 23:48:08', 34),
(274, 1, 350, '2026-03-19 23:48:08', 35),
(275, 2, 76, '2026-03-19 23:48:08', 35),
(276, 3, 182, '2026-03-19 23:48:08', 35),
(277, 4, 182, '2026-03-19 23:48:08', 35),
(278, 5, 316, '2026-03-19 23:48:08', 35);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD UNIQUE KEY `unique_warehouse_product` (`warehouse_id`,`product_id`),
  ADD KEY `fk_inventory_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=359;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_inventory_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `ware_houses` (`warehouse_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------

--
-- Table structure for table `order_details_inventory`
--

CREATE TABLE `order_details_inventory` (
  `order_detail_id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details_inventory`
--

INSERT INTO `order_details_inventory` (`order_detail_id`, `inventory_id`) VALUES
(1, 190),
(2, 173),
(3, 192),
(4, 163),
(5, 134),
(6, 254),
(7, 239),
(8, 155),
(9, 127),
(10, 245),
(11, 212),
(12, 224),
(13, 204),
(14, 245),
(15, 158),
(16, 128),
(17, 239),
(18, 182),
(19, 262),
(20, 138);

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


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
(20, 14, 1);

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


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
(14, 1, '2025-12-01 15:17:08', 2412.00, 'processing');

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

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
(12, 14, 'cash', 'Undefine by Cash', 'success', '2025-12-01 15:17:08');

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------

--
-- Table structure for table `personal_shopping_bag`
--

CREATE TABLE `personal_shopping_bag` (
  `shopping_bag_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_shopping_bag`
--

INSERT INTO `personal_shopping_bag` (`shopping_bag_id`, `customer_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  ADD PRIMARY KEY (`shopping_bag_id`),
  ADD UNIQUE KEY `customer_id` (`customer_id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  MODIFY `shopping_bag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `personal_shopping_bag`
--
ALTER TABLE `personal_shopping_bag`
  ADD CONSTRAINT `personal_shopping_bag_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_description` text DEFAULT NULL,
  `price_unit` decimal(10,2) NOT NULL,
  `product_category` varchar(100) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `price_unit`, `product_category`, `product_image`, `created_at`) VALUES
(1, '3 Day WKND', '3 Day WKND', 300.00, 'candle', '../../../../assets/img/Automation/Image/1.jpg', '2026-03-19 16:25:10'),
(2, 'Amber And Vanilla', 'Amber And Vanilla', 400.00, 'candle', '../../../../assets/img/Automation/Image/2.jpg', '2026-03-19 16:25:10'),
(3, 'Coconut And Sea Salt', 'Coconut And Sea Salt', 250.00, 'candle', '../../../../assets/img/Automation/Image/3.jpg', '2026-03-19 16:25:10'),
(4, 'Day Party', 'Day Party', 150.00, 'candle', '../../../../assets/img/Automation/Image/4.jpg', '2026-03-19 16:25:10'),
(5, 'Jasmin ylang ylang sandalwood', 'Jasmin ylang ylang sandalwood', 275.00, 'candle', '../../../../assets/img/Automation/Image/5.jpg', '2026-03-19 16:25:10'),
(6, 'Lavander Vanilia', 'Lavander Vanilia', 195.00, 'candle', '../../../../assets/img/Automation/Image/6.jpg', '2026-03-19 16:25:10'),
(7, 'Milk Vanilla', 'Milk Vanilla', 150.00, 'candle', '../../../../assets/img/Automation/Image/7.jpg', '2026-03-19 16:25:10'),
(8, 'Sandalwood And Rose', 'Sandalwood And Rose', 250.00, 'candle', '../../../../assets/img/Automation/Image/8.jpg', '2026-03-19 16:25:10'),
(9, 'Shower Playlist', 'Shower Playlist', 240.00, 'candle', '../../../../assets/img/Automation/Image/9.jpg', '2026-03-19 16:25:10'),
(10, 'Smells Like Cacao And Vanilla', 'Smells Like Cacao And Vanilla', 190.00, 'candle', '../../../../assets/img/Automation/Image/10.jpg', '2026-03-19 16:25:10'),
(11, 'Sunset Disco', 'Sunset Disco', 150.00, 'candle', '../../../../assets/img/Automation/Image/11.jpg', '2026-03-19 16:25:10'),
(12, 'Warn Cider And Cinamon', 'Warn Cider And Cinamon', 450.00, 'candle', '../../../../assets/img/Automation/Image/12.jpg', '2026-03-19 16:25:10'),
(13, 'Lumos Honeydrew And Coconut', 'Lumos Honeydrew And Coconut', 480.00, 'oil', '../../../../assets/img/Automation/Image/13.jpg', '2026-03-19 16:25:10'),
(14, 'Lumos Tropical Orchard', 'Lumos Tropical Orchard', 480.00, 'oil', '../../../../assets/img/Automation/Image/14.jpg', '2026-03-19 16:25:10'),
(15, 'Lumos Rose Boutique', 'Lumos Rose Boutique', 480.00, 'oil', '../../../../assets/img/Automation/Image/15.jpg', '2026-03-19 16:25:10'),
(16, 'Lumos Lemongrass', 'Lumos Lemongrass', 255.00, 'oil', '../../../../assets/img/Automation/Image/16.jpg', '2026-03-19 16:25:10'),
(17, 'Lumos Cajeput', 'Lumos Cajeput', 255.00, 'oil', '../../../../assets/img/Automation/Image/17.jpg', '2026-03-19 16:25:10'),
(18, 'Lumos menthol', 'Lumos menthol', 255.00, 'oil', '../../../../assets/img/Automation/Image/18.jpg', '2026-03-19 16:25:10'),
(19, 'Lumos cold', 'Lumos cold', 255.00, 'oil', '../../../../assets/img/Automation/Image/19.jpg', '2026-03-19 16:25:10'),
(20, 'Lumos And Cucumber', 'Lumos And Cucumber', 450.00, 'oil', '../../../../assets/img/Automation/Image/20.jpg', '2026-03-19 16:25:10'),
(21, 'Lumos Juicy Peach', 'Lumos Juicy Peach', 450.00, 'oil', '../../../../assets/img/Automation/Image/21.jpg', '2026-03-19 16:25:10'),
(22, 'Lumos Midnight sandalwood', 'Lumos Midnight sandalwood', 600.00, 'oil', '../../../../assets/img/Automation/Image/22.jpg', '2026-03-19 16:25:10'),
(23, 'YOU ARE THE MAGIC', 'YOU ARE THE MAGIC', 295.00, 'candle', '../../../../assets/img/Automation/Image/23.jpg', '2026-03-19 16:25:10'),
(24, 'BLOW A WISH', 'BLOW A WISH', 315.00, 'candle', '../../../../assets/img/Automation/Image/24.jpg', '2026-03-19 16:25:10'),
(25, 'Candle Tray', 'Candle Tray', 80.00, 'accessory', '../../../../assets/img/Automation/Image/25.jpg', '2026-03-19 16:25:10'),
(26, 'Candle Snuffer', 'Candle Snuffer', 85.00, 'accessory', '../../../../assets/img/Automation/Image/26.jpg', '2026-03-19 16:25:10'),
(27, 'Candle Scissor', 'Candle Scissor', 80.00, 'accessory', '../../../../assets/img/Automation/Image/27.jpg', '2026-03-19 16:25:10'),
(28, 'Candle matchbox', 'Candle matchbox', 10.00, 'accessory', '../../../../assets/img/Automation/Image/28.jpg', '2026-03-19 16:25:10'),
(29, 'Candle rotation tray', 'Candle rotation tray', 89.00, 'accessory', '../../../../assets/img/Automation/Image/29.jpg', '2026-03-19 16:25:10'),
(30, 'Candle pinwheel', 'Candle pinwheel', 90.00, 'accessory', '../../../../assets/img/Automation/Image/30.jpg', '2026-03-19 16:25:10'),
(31, 'Candle metal tray', 'Candle metal tray', 150.00, 'accessory', '../../../../assets/img/Automation/Image/31.jpg', '2026-03-19 16:25:10'),
(32, 'Candle holder', 'Candle holder', 90.00, 'accessory', '../../../../assets/img/Automation/Image/32.jpg', '2026-03-19 16:25:10'),
(33, 'Wood tray', 'Wood tray', 20.00, 'accessory', '../../../../assets/img/Automation/Image/33.jpg', '2026-03-19 16:25:10'),
(34, 'Nen_and_Hoa', 'Nen_and_Hoa', 600.00, 'candle', '../../../../assets/img/Automation/Image/39.jpg', '2026-03-19 16:25:10'),
(35, 'Dalat Gift', 'Dalat Gift', 600.00, 'gift', '../../../../assets/img/Automation/Image/40.jpg', '2026-03-19 16:25:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------

--
-- Table structure for table `shopping_bag_item`
--

CREATE TABLE `shopping_bag_item` (
  `bag_item_id` int(11) NOT NULL,
  `shopping_bag_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shopping_bag_item`
--

INSERT INTO `shopping_bag_item` (`bag_item_id`, `shopping_bag_id`, `product_id`, `quantity`) VALUES
(1, 1, 1, 2),
(2, 2, 1, 5),
(3, 3, 1, 5),
(4, 4, 1, 1),
(5, 5, 1, 3),
(6, 6, 1, 1),
(7, 7, 1, 2),
(8, 8, 1, 5),
(9, 9, 1, 4),
(10, 10, 1, 4),
(11, 1, 2, 2),
(12, 2, 2, 3),
(13, 3, 2, 5),
(14, 4, 2, 4),
(15, 5, 2, 3),
(16, 6, 2, 3),
(17, 7, 2, 3),
(18, 8, 2, 3),
(19, 9, 2, 5),
(20, 10, 2, 3),
(21, 1, 3, 5),
(22, 2, 3, 5),
(23, 3, 3, 1),
(24, 4, 3, 1),
(25, 5, 3, 5),
(26, 6, 3, 3),
(27, 7, 3, 1),
(28, 8, 3, 5),
(29, 9, 3, 5),
(30, 10, 3, 1),
(31, 1, 4, 1),
(32, 2, 4, 4),
(33, 3, 4, 2),
(34, 4, 4, 3),
(35, 5, 4, 3),
(36, 6, 4, 2),
(37, 7, 4, 5),
(38, 8, 4, 3),
(39, 9, 4, 1),
(40, 10, 4, 4),
(41, 1, 5, 1),
(42, 2, 5, 4),
(43, 3, 5, 1),
(44, 4, 5, 2),
(45, 5, 5, 5),
(46, 6, 5, 1),
(47, 7, 5, 3),
(48, 8, 5, 3),
(49, 9, 5, 4),
(50, 10, 5, 4),
(51, 1, 6, 5),
(52, 2, 6, 2),
(53, 3, 6, 1),
(54, 4, 6, 4),
(55, 5, 6, 3),
(56, 6, 6, 5),
(57, 7, 6, 5),
(58, 8, 6, 1),
(59, 9, 6, 5),
(60, 10, 6, 1),
(61, 1, 7, 5),
(62, 2, 7, 4),
(63, 3, 7, 3),
(64, 4, 7, 5),
(65, 5, 7, 1),
(66, 6, 7, 2),
(67, 7, 7, 4),
(68, 8, 7, 3),
(69, 9, 7, 2),
(70, 10, 7, 2),
(71, 1, 8, 4),
(72, 2, 8, 4),
(73, 3, 8, 1),
(74, 4, 8, 4),
(75, 5, 8, 1),
(76, 6, 8, 2),
(77, 7, 8, 1),
(78, 8, 8, 4),
(79, 9, 8, 4),
(80, 10, 8, 1),
(81, 1, 9, 1),
(82, 2, 9, 4),
(83, 3, 9, 3),
(84, 4, 9, 5),
(85, 5, 9, 5),
(86, 6, 9, 4),
(87, 7, 9, 4),
(88, 8, 9, 2),
(89, 9, 9, 4),
(90, 10, 9, 2),
(91, 1, 10, 5),
(92, 2, 10, 3),
(93, 3, 10, 4),
(94, 4, 10, 5),
(95, 5, 10, 2),
(96, 6, 10, 2),
(97, 7, 10, 2),
(98, 8, 10, 3),
(99, 9, 10, 3),
(100, 10, 10, 5),
(101, 1, 11, 5),
(102, 2, 11, 4),
(103, 3, 11, 5),
(104, 4, 11, 4),
(105, 5, 11, 4),
(106, 6, 11, 1),
(107, 7, 11, 4),
(108, 8, 11, 1),
(109, 9, 11, 1),
(110, 10, 11, 3),
(111, 1, 12, 2),
(112, 2, 12, 1),
(113, 3, 12, 1),
(114, 4, 12, 2),
(115, 5, 12, 2),
(116, 6, 12, 1),
(117, 7, 12, 2),
(118, 8, 12, 5),
(119, 9, 12, 5),
(120, 10, 12, 2),
(121, 1, 13, 2),
(122, 2, 13, 1),
(123, 3, 13, 5),
(124, 4, 13, 1),
(125, 5, 13, 4),
(126, 6, 13, 1),
(127, 7, 13, 4),
(128, 8, 13, 4),
(129, 9, 13, 3),
(130, 10, 13, 3),
(131, 1, 14, 4),
(132, 2, 14, 1),
(133, 3, 14, 3),
(134, 4, 14, 3),
(135, 5, 14, 3),
(136, 6, 14, 5),
(137, 7, 14, 1),
(138, 8, 14, 5),
(139, 9, 14, 2),
(140, 10, 14, 2),
(141, 1, 15, 2),
(142, 2, 15, 1),
(143, 3, 15, 2),
(144, 4, 15, 5),
(145, 5, 15, 1),
(146, 6, 15, 3),
(147, 7, 15, 5),
(148, 8, 15, 4),
(149, 9, 15, 5),
(150, 10, 15, 1),
(151, 1, 16, 4),
(152, 2, 16, 3),
(153, 3, 16, 3),
(154, 4, 16, 5),
(155, 5, 16, 5),
(156, 6, 16, 1),
(157, 7, 16, 3),
(158, 8, 16, 3),
(159, 9, 16, 5),
(160, 10, 16, 5),
(161, 1, 17, 5),
(162, 2, 17, 1),
(163, 3, 17, 2),
(164, 4, 17, 1),
(165, 5, 17, 4),
(166, 6, 17, 2),
(167, 7, 17, 5),
(168, 8, 17, 2),
(169, 9, 17, 2),
(170, 10, 17, 5),
(171, 1, 18, 3),
(172, 2, 18, 4),
(173, 3, 18, 2),
(174, 4, 18, 5),
(175, 5, 18, 2),
(176, 6, 18, 2),
(177, 7, 18, 5),
(178, 8, 18, 3),
(179, 9, 18, 4),
(180, 10, 18, 4),
(181, 1, 19, 4),
(182, 2, 19, 5),
(183, 3, 19, 1),
(184, 4, 19, 3),
(185, 5, 19, 5),
(186, 6, 19, 2),
(187, 7, 19, 5),
(188, 8, 19, 2),
(189, 9, 19, 2),
(190, 10, 19, 3),
(191, 1, 20, 4),
(192, 2, 20, 1),
(193, 3, 20, 3),
(194, 4, 20, 2),
(195, 5, 20, 1),
(196, 6, 20, 3),
(197, 7, 20, 2),
(198, 8, 20, 4),
(199, 9, 20, 5),
(200, 10, 20, 5),
(201, 1, 21, 3),
(202, 2, 21, 2),
(203, 3, 21, 3),
(204, 4, 21, 5),
(205, 5, 21, 3),
(206, 6, 21, 4),
(207, 7, 21, 1),
(208, 8, 21, 2),
(209, 9, 21, 2),
(210, 10, 21, 5),
(211, 1, 22, 3),
(212, 2, 22, 5),
(213, 3, 22, 4),
(214, 4, 22, 4),
(215, 5, 22, 4),
(216, 6, 22, 1),
(217, 7, 22, 4),
(218, 8, 22, 5),
(219, 9, 22, 1),
(220, 10, 22, 2),
(221, 1, 23, 1),
(222, 2, 23, 3),
(223, 3, 23, 2),
(224, 4, 23, 5),
(225, 5, 23, 4),
(226, 6, 23, 3),
(227, 7, 23, 2),
(228, 8, 23, 3),
(229, 9, 23, 2),
(230, 10, 23, 5),
(231, 1, 24, 4),
(232, 2, 24, 3),
(233, 3, 24, 2),
(234, 4, 24, 2),
(235, 5, 24, 5),
(236, 6, 24, 1),
(237, 7, 24, 5),
(238, 8, 24, 1),
(239, 9, 24, 3),
(240, 10, 24, 3),
(241, 1, 25, 4),
(242, 2, 25, 1),
(243, 3, 25, 2),
(244, 4, 25, 2),
(245, 5, 25, 1),
(246, 6, 25, 5),
(247, 7, 25, 3),
(248, 8, 25, 3),
(249, 9, 25, 1),
(250, 10, 25, 2),
(251, 1, 26, 1),
(252, 2, 26, 3),
(253, 3, 26, 3),
(254, 4, 26, 5),
(255, 5, 26, 4),
(256, 6, 26, 2),
(257, 7, 26, 3),
(258, 8, 26, 2),
(259, 9, 26, 1),
(260, 10, 26, 3),
(261, 1, 27, 1),
(262, 2, 27, 3),
(263, 3, 27, 5),
(264, 4, 27, 4),
(265, 5, 27, 5),
(266, 6, 27, 5),
(267, 7, 27, 3),
(268, 8, 27, 5),
(269, 9, 27, 4),
(270, 10, 27, 2),
(271, 1, 28, 5),
(272, 2, 28, 4),
(273, 3, 28, 5),
(274, 4, 28, 3),
(275, 5, 28, 4),
(276, 6, 28, 1),
(277, 7, 28, 1),
(278, 8, 28, 3),
(279, 9, 28, 2),
(280, 10, 28, 3),
(281, 1, 29, 1),
(282, 2, 29, 3),
(283, 3, 29, 2),
(284, 4, 29, 3),
(285, 5, 29, 2),
(286, 6, 29, 2),
(287, 7, 29, 1),
(288, 8, 29, 1),
(289, 9, 29, 1),
(290, 10, 29, 3),
(291, 1, 30, 4),
(292, 2, 30, 2),
(293, 3, 30, 3),
(294, 4, 30, 2),
(295, 5, 30, 1),
(296, 6, 30, 2),
(297, 7, 30, 4),
(298, 8, 30, 4),
(299, 9, 30, 3),
(300, 10, 30, 4),
(301, 1, 31, 3),
(302, 2, 31, 4),
(303, 3, 31, 2),
(304, 4, 31, 5),
(305, 5, 31, 5),
(306, 6, 31, 2),
(307, 7, 31, 5),
(308, 8, 31, 4),
(309, 9, 31, 4),
(310, 10, 31, 1),
(311, 1, 32, 3),
(312, 2, 32, 2),
(313, 3, 32, 3),
(314, 4, 32, 5),
(315, 5, 32, 2),
(316, 6, 32, 4),
(317, 7, 32, 5),
(318, 8, 32, 1),
(319, 9, 32, 1),
(320, 10, 32, 3),
(321, 1, 33, 4),
(322, 2, 33, 5),
(323, 3, 33, 4),
(324, 4, 33, 3),
(325, 5, 33, 4),
(326, 6, 33, 3),
(327, 7, 33, 5),
(328, 8, 33, 3),
(329, 9, 33, 5),
(330, 10, 33, 4),
(331, 1, 34, 2),
(332, 2, 34, 3),
(333, 3, 34, 3),
(334, 4, 34, 1),
(335, 5, 34, 1),
(336, 6, 34, 2),
(337, 7, 34, 2),
(338, 8, 34, 3),
(339, 9, 34, 3),
(340, 10, 34, 5),
(341, 1, 35, 5),
(342, 2, 35, 4),
(343, 3, 35, 3),
(344, 4, 35, 1),
(345, 5, 35, 3),
(346, 6, 35, 1),
(347, 7, 35, 2),
(348, 8, 35, 2),
(349, 9, 35, 3),
(350, 10, 35, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `shopping_bag_item`
--
ALTER TABLE `shopping_bag_item`
  ADD PRIMARY KEY (`bag_item_id`),
  ADD KEY `fk_bag` (`shopping_bag_id`),
  ADD KEY `fk_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `shopping_bag_item`
--
ALTER TABLE `shopping_bag_item`
  MODIFY `bag_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=512;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `shopping_bag_item`
--
ALTER TABLE `shopping_bag_item`
  ADD CONSTRAINT `fk_bag` FOREIGN KEY (`shopping_bag_id`) REFERENCES `personal_shopping_bag` (`shopping_bag_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


