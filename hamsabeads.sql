-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 31, 2025 at 05:17 PM
-- Server version: 8.2.0
-- PHP Version: 8.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hamsabeads`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `adminID` varchar(30) NOT NULL,
  `adminName` varchar(30) NOT NULL,
  `adminMail` varchar(30) NOT NULL,
  `adminPW` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminID`, `adminName`, `adminMail`, `adminPW`) VALUES
('A0001', 'HBAdmin', 'hbadmin@gmail.com', 'hb@Admin');

-- --------------------------------------------------------

--
-- Table structure for table `useraccount`
--

CREATE TABLE `useraccount` (
  `userID` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `useraccount`
--

INSERT INTO `useraccount` (`userID`, `username`, `email`, `password`) VALUES
('HB0000', 'Athy', 'athyjunn@gmail.com', '$2y$10$j7u4l455gJ8zcWBsP7D.nuDwl11dMJMszdgA6r9pry5oCV8nkMkdu'),
('HB0001', 'MichiBaka1', 'michibaka1@gmail.com', '$2y$10$SALwaDh1peihcW5Z14dQceN1cRB.nSbs9b4ZPfhLpst.l8MfnoyM2'),
('HB0002', 'MichiBaka2', 'michibaka2@gmail.com', '$2y$10$z8NQndLbwgfq7qW7EHa/tumiTMLkzy2P4RpCHdMG5oF6uo7wNuzMa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminID`),
  ADD UNIQUE KEY `adminMail` (`adminMail`);

--
-- Indexes for table `useraccount`
--
ALTER TABLE `useraccount`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;