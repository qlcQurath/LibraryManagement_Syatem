-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 04, 2024 at 03:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `librarymanagementsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `pswd` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `pswd`) VALUES
(1, 'admin@gmail.com', 'Admin@123');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `ID_B` varchar(150) NOT NULL,
  `book_name` varchar(100) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `book_count` int(11) DEFAULT NULL,
  `cost_per_book` int(11) DEFAULT NULL,
  `total_cost` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`ID_B`, `book_name`, `author`, `publisher`, `book_count`, `cost_per_book`, `total_cost`) VALUES
('03e5e6bd-9a71-4427-b957-580fc500dfe3', 'Structural Analysis', 'R.C. Hibbeler', 'Pearson', 2, 18040, 36080),
('08060f27-6bb8-4fe4-8016-c69f93881000', 'Thermodynamics: An Engineering Approach', 'Yunus A. Çengel, Michael A. Boles', 'McGraw-Hill Education', 6, 14750, 88500),
('227382b1-4219-4b69-919b-4e80dfe3ed02', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', 'MIT Press', 5, 8195, 40975),
('29fce66b-a09a-4487-96cd-fed3652118e1', 'The C Programming Language', 'Brain W. Kernighan, Dennis M, Ritchie', 'Prentice Hall', 9, 500, 4500),
('63ba08ed-4a2c-4d35-90c8-1f89bb74a48c', 'Database System Concepts', 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan', 'McGraw-Hill', 8, 1100, 8800),
('7c1d3bfa-0bbf-4d53-8256-b3f0f7ebc3b7', 'Engineering Mechanics: Dynamics', 'J.L. Meriam, L.G. Kraige', 'Wiley', 6, 12300, 73800),
('9a7a68c4-43b9-4175-96fe-b5d97b46286f', 'Computer Networks', 'Andrew S. Tanenbaum, David J. Wetherall', 'Pearson', 10, 13230, 132300),
('aa842eb4-39ee-4212-9e8f-7d1d67d76c70', 'Signals and Systems', 'Alan V. Oppenheim, Alan S. Willsky, S. Hamid Nawab', 'Pearson', 3, 11890, 35670),
('c6c6465e-238a-49f8-b1c3-60ec5a3c70f7', 'Fluid Mechanics', 'Frank M. White', 'McGraw-Hill Education', 4, 14350, 57400),
('dd2c75c9-348b-4e2f-ba6c-6f7182ede10a', 'Operating System Concepts', 'Abraham Silberschatz, Peter B. Galvin, Galvin, Greg Gagne', 'Wiley', 10, 900, 9000);

-- --------------------------------------------------------

--
-- Table structure for table `book_issue`
--

CREATE TABLE `book_issue` (
  `ID_B` varchar(150) DEFAULT NULL,
  `book_name` varchar(100) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `USN` varchar(100) DEFAULT NULL,
  `std_borrow_count` int(11) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `return_status` varchar(20) DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `fine` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book_issue`
--

INSERT INTO `book_issue` (`ID_B`, `book_name`, `author`, `publisher`, `USN`, `std_borrow_count`, `issue_date`, `due_date`, `return_status`, `return_date`, `fine`) VALUES
('03e5e6bd-9a71-4427-b957-580fc500dfe3', 'Structural Analysis', 'R.C. Hibbeler', 'Pearson', '4JO22EC034', 1, '2024-06-18', '2024-07-03', 'Not Returned', NULL, 20),
('08060f27-6bb8-4fe4-8016-c69f93881000', 'Thermodynamics: An Engineering Approach', 'Yunus A. Çengel, Michael A. Boles', 'McGraw-Hill Education', '4JO22EC034', 2, '2024-07-04', '2024-07-19', 'Not Returned', NULL, 0),
('aa842eb4-39ee-4212-9e8f-7d1d67d76c70', 'Signals and Systems', 'Alan V. Oppenheim, Alan S. Willsky, S. Hamid Nawab', 'Pearson', '4JO22EC034', 3, '2024-06-18', '2024-07-03', 'Not Returned', NULL, 20);

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `usn` varchar(20) DEFAULT NULL,
  `course` varchar(50) DEFAULT NULL,
  `branch` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phoneno` varchar(15) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`id`, `firstname`, `lastname`, `age`, `gender`, `usn`, `course`, `branch`, `email`, `phoneno`, `password`, `registration_date`) VALUES
(1, 'Raam', 'Sharma', 20, 'Male', '4JO18CS014', 'B.E', 'CSE', 'raamsharma@gmail.com', '9237867890', 'Raams@123', '2024-06-12 08:08:29'),
(2, 'John', 'Doe', 20, 'Male', '4JO22EC034', 'B.E', 'ECE', 'johndoe@gmail.com', '6789012345', 'Johnd@123', '2024-06-25 08:40:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`ID_B`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_data`
--
ALTER TABLE `user_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
