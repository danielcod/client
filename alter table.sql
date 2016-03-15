ALTER TABLE `sl_users` ADD q6 VARCHAR( 255 ) DEFAULT ''


CREATE TABLE IF NOT EXISTS `sl_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pagetitle` varchar(80) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;

--
-- Dumping data for table `table_users`
--

INSERT INTO `sl_pages` (`id`, `pagetitle`, `description`) VALUES
(1, 'Slides', 'Slides Edit'),
(2, 'Crawls', 'Crawls Edit'),
(3, 'ViewSchedule', 'View slide schedule'),
(4, 'Players', 'View Players');