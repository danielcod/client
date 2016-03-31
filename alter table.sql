ALTER TABLE `sl_users` ADD `permission` VARCHAR( 255 ) DEFAULT ''
ALTER TABLE `sl_users` ADD `role` VARCHAR( 255 ) DEFAULT ''
ALTER TABLE `sl_users` ADD `parent_admin` VARCHAR( 255 ) DEFAULT ''


CREATE TABLE IF NOT EXISTS `sl_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pagetitle` varchar(80) NOT NULL,
  `url` varchar(80) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;


CREATE TABLE IF NOT EXISTS `sl_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slidename` varchar(80) NOT NULL,
  `owner` varchar(80) NOT NULL,
  `width` int(8) NOT NULL,
  `height` int(8) NOT NULL,
  `activation` int(1) NOT NULL DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;

DROP TABLE IF EXISTS `onpar`.`sl_texts`;
CREATE TABLE  `onpar`.`sl_texts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(5) NOT NULL,
  `text` varchar(250) NOT NULL DEFAULT '',
  `display_order` int(11) DEFAULT NULL,
  `begin_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `delete_date` datetime DEFAULT NULL,
  `active_always` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `table_users`
--

INSERT INTO `sl_pages` (`id`, `pagetitle`, `url`, `description`) VALUES
(1, 'Slides', '/' , 'Slides Edit'),
(2, 'Crawls', '/crawl', 'Crawls Edit'),
(3, 'Players', '/players', 'View Players'),
(4, 'ViewSchedule', '/viewschedule', 'View slide schedule');