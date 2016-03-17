ALTER TABLE `sl_users` ADD `permission` VARCHAR( 255 ) DEFAULT ''
ALTER TABLE `sl_users` ADD `role` VARCHAR( 255 ) DEFAULT ''


CREATE TABLE IF NOT EXISTS `sl_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pagetitle` varchar(80) NOT NULL,
  `url` varchar(80) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;

--
-- Dumping data for table `table_users`
--

INSERT INTO `sl_pages` (`id`, `pagetitle`, `url`, `description`) VALUES
(1, 'Slides', '/' , 'Slides Edit'),
(2, 'Crawls', '/crawl', 'Crawls Edit'),
(3, 'Players', '/players', 'View Players'),
(4, 'ViewSchedule', '/viewschedule', 'View slide schedule');