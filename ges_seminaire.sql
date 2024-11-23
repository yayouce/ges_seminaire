-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 23 nov. 2024 à 12:03
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ges_seminaire`
--

-- --------------------------------------------------------

--
-- Structure de la table `commission`
--

DROP TABLE IF EXISTS `commission`;
CREATE TABLE IF NOT EXISTS `commission` (
  `idComi` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `libelleComi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idComi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commission`
--

INSERT INTO `commission` (`idComi`, `libelleComi`) VALUES
('09ead9af-6f26-4dde-b007-31b5d366267a', 'Communication'),
('4811aec6-725e-4e1f-aab2-ee68bea8b5bb', 'Finance'),
('59c819bb-44c9-4e1f-bf09-20be36c50c49', 'Pépinière'),
('5fd8aea7-f496-4127-b9bf-14278616da2f', 'Santé'),
('6764bdb9-fcd6-4649-81cc-79e7ebca0073', 'Logistique'),
('6866d28a-fdd2-4b81-a767-d55ddff16f7f', 'Accueil_Hébegement'),
('8d065fc6-026d-44b5-b8ec-6b27b7d74fe8', 'Formation'),
('95a66ba6-7d2e-4eea-8adb-c7c3caa8f28a', 'Hygiène'),
('aa5db98f-ef42-4439-87ab-b11e4bee4c04', 'Protocole'),
('c86841ab-4632-4d16-819c-1db73e30ccb4', 'Sécurité'),
('d6649cfe-6a7b-4936-9da9-8fd29e90f900', 'Administration'),
('ea70cf32-cf72-4943-8756-51ef5e060065', 'Restauration');

-- --------------------------------------------------------

--
-- Structure de la table `dortoir`
--

DROP TABLE IF EXISTS `dortoir`;
CREATE TABLE IF NOT EXISTS `dortoir` (
  `idDortoir` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nomDortoir` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nbPlace` int NOT NULL,
  `genre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `membreCoIdpers` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`idDortoir`),
  KEY `FK_f526d48a4fc6fac51a866763c1f` (`membreCoIdpers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `dortoir`
--

INSERT INTO `dortoir` (`idDortoir`, `nomDortoir`, `nbPlace`, `genre`, `membreCoIdpers`) VALUES
('2c74b2d7-9f38-4ebd-93d1-5b6396251937', 'mamadou', 50, 'M', '4a936e8c-2be8-479b-b967-0f47d5c8e7f3'),
('48ed64b7-1d47-4d3a-bf88-c27238d0f011', 'Ali', 50, 'M', '4a936e8c-2be8-479b-b967-0f47d5c8e7f3');

-- --------------------------------------------------------

--
-- Structure de la table `membreco`
--

DROP TABLE IF EXISTS `membreco`;
CREATE TABLE IF NOT EXISTS `membreco` (
  `idpers` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nomPers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pernomPers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `genrePers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phonePers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `situation` tinyint NOT NULL,
  `commissionIdComi` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `motPass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rolePers` enum('pco','Communication','Formation','Restauration','Securité','Finance','Protocole','Hygiène','Administration','Accueil_Hébegement','Logistique','Pépinière','Santé') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `roleMembre` enum('responsable','reponsable_adjoint','simple') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'simple',
  `sousComite` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idpers`),
  UNIQUE KEY `IDX_ed520e273c3081a62d9fe282fd` (`phonePers`),
  KEY `FK_10b5618cfd13f4f3007632c79d3` (`commissionIdComi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `membreco`
--

INSERT INTO `membreco` (`idpers`, `nomPers`, `pernomPers`, `genrePers`, `phonePers`, `situation`, `commissionIdComi`, `motPass`, `rolePers`, `roleMembre`, `sousComite`) VALUES
('0d3a068c-cb65-4bfe-b258-e2e0ccfcf8ea', 'Diarra', 'Yaya abdel aziz', 'masculin', '0586655041', 1, 'd6649cfe-6a7b-4936-9da9-8fd29e90f900', '$2b$10$fJJ6bt96P6XJB24ClNN3Sef/H.tUzcfA3ThPq0W5FxnBmYCHWpcbW', 'Administration', 'responsable', 'sc2 yop'),
('1dc8827d-87f9-4b3f-8cbc-ef1fe77ae1d5', 'Sylla', 'elimane', 'masculin', '0586655043', 1, 'd6649cfe-6a7b-4936-9da9-8fd29e90f900', '$2b$10$teNphLjPMWM3OsqAbQdnAO8h5q6X/259d7Cf72c9sQ0y1EEMpcLha', 'Administration', 'simple', 'sc2 yop'),
('4a936e8c-2be8-479b-b967-0f47d5c8e7f3', 'Sylla', 'elimane', 'masculin', '0586655085', 1, '6866d28a-fdd2-4b81-a767-d55ddff16f7f', '$2b$10$6.Sj7/3bdJKdr0U1Nk47g./jnQJdud43h52YaKhLYjwCl3Vwj3gY6', 'Accueil_Hébegement', 'responsable', 'sc2 yop'),
('53bba410-45e2-43f0-94a0-ce83a010274c', 'Sylla', 'elimane', 'masculin', '0586655049', 1, 'd6649cfe-6a7b-4936-9da9-8fd29e90f900', '$2b$10$aKdkwxOUJPHOVXeOw9dAQ.eGpDgJW02B3aTqaqF2NSjqljm8T/Pzu', 'Administration', 'simple', 'sc2 yop'),
('5b8b5409-d957-4fe2-9bb3-be612e647862', 'Sylla', 'elimane', 'masculin', '0586655048', 1, 'd6649cfe-6a7b-4936-9da9-8fd29e90f900', '$2b$10$J6k6SIqwbWp97/6HesfA2u4nka9nSbZWPv.I.AY3xm3.u4iMKx/ve', 'Administration', 'simple', 'sc2 yop'),
('ee161775-47d6-42f8-844f-868a4d7ef0dc', 'Diarra', 'Yaya abdel aziz', 'masculin', '0586655042', 1, 'd6649cfe-6a7b-4936-9da9-8fd29e90f900', '$2b$10$W1h7lFBg2R867d7C9daoDOTnz6GQ0smiUX9nD6sSLnUTqwVavamJe', 'Administration', 'simple', 'sc2 yop');

-- --------------------------------------------------------

--
-- Structure de la table `personne`
--

DROP TABLE IF EXISTS `personne`;
CREATE TABLE IF NOT EXISTS `personne` (
  `idpers` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `motPass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nomPers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pernomPers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `genrePers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phonePers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `situation` tinyint NOT NULL,
  `rolePers` enum('pco','Communication','Formation','Restauration','Securité','Finance','Protocole','Hygiène','Administration','Accueil_Hébegement','Logistique','Pépinière','Santé') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sousComite` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idpers`),
  UNIQUE KEY `IDX_5e3b95aa96e37f398850042fdc` (`phonePers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `seminariste`
--

DROP TABLE IF EXISTS `seminariste`;
CREATE TABLE IF NOT EXISTS `seminariste` (
  `idSemi` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `genreSemi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phoneSemi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `situation` tinyint NOT NULL DEFAULT '1',
  `sousComite` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `numUrgence` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `membreCoIdpers` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dortoirIdDortoir` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nomSemi_prenom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `categorie` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `age` int NOT NULL,
  PRIMARY KEY (`idSemi`),
  KEY `FK_fc545cf92194756884cc9ececd1` (`membreCoIdpers`),
  KEY `FK_4fa043b6b28dd9b573e81709fc9` (`dortoirIdDortoir`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `seminariste`
--

INSERT INTO `seminariste` (`idSemi`, `genreSemi`, `phoneSemi`, `situation`, `sousComite`, `numUrgence`, `membreCoIdpers`, `dortoirIdDortoir`, `nomSemi_prenom`, `categorie`, `age`) VALUES
('00d10806-5b78-4b98-8e4d-31530c057761', 'M', '09876545678', 1, 'yop2', '09876567890', '4a936e8c-2be8-479b-b967-0f47d5c8e7f3', '48ed64b7-1d47-4d3a-bf88-c27238d0f011', 'diarra yaya', 'jeune', 15),
('5937a792-10a2-4bf3-be55-2aa582fbc785', 'M', '09876545678', 1, 'yop2', '09876567890', '4a936e8c-2be8-479b-b967-0f47d5c8e7f3', '2c74b2d7-9f38-4ebd-93d1-5b6396251937', '', '', 0),
('67c7f7e2-85b3-4533-abd9-a8882b24bd10', 'M', '09876545678', 1, 'yop2', '09876567890', '4a936e8c-2be8-479b-b967-0f47d5c8e7f3', '48ed64b7-1d47-4d3a-bf88-c27238d0f011', 'diarra yaya', '', 0),
('dab2dc8a-e850-4291-a173-611dbe790233', 'M', '09876545678', 1, 'yop2', '09876567890', '4a936e8c-2be8-479b-b967-0f47d5c8e7f3', '48ed64b7-1d47-4d3a-bf88-c27238d0f011', '', '', 0),
('ecfca4a1-15c3-4788-b6f6-3fc028b4b76d', 'M', '0704113821', 1, 'Yop 2', '07041112222', NULL, NULL, '', '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `superadmin`
--

DROP TABLE IF EXISTS `superadmin`;
CREATE TABLE IF NOT EXISTS `superadmin` (
  `loginSupAdmin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `idSupAdmin` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `motPassSupAdmin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idSupAdmin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `superadmin`
--

INSERT INTO `superadmin` (`loginSupAdmin`, `idSupAdmin`, `motPassSupAdmin`) VALUES
('Alikwane2024', 'd342dc8c-bc23-45fc-991b-737e7fe957b0', '$2b$10$D5bSDuQUqFoBqGLq3RJ0p.xZ6LZOvSS6Oqdl0LCs7yXQCprg7J922');

-- --------------------------------------------------------

--
-- Structure de la table `visiteur`
--

DROP TABLE IF EXISTS `visiteur`;
CREATE TABLE IF NOT EXISTS `visiteur` (
  `idpers` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nomPers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pernomPers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `genrePers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phonePers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `situation` tinyint NOT NULL,
  `dateEntr` datetime NOT NULL,
  `dateSorti` datetime NOT NULL,
  `motPass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rolePers` enum('pco','Communication','Formation','Restauration','Securité','Finance','Protocole','Hygiène','Administration','Accueil_Hébegement','Logistique','Pépinière','Santé') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sousComite` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idpers`),
  UNIQUE KEY `IDX_9deccfd053c2b3172131063514` (`phonePers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `dortoir`
--
ALTER TABLE `dortoir`
  ADD CONSTRAINT `FK_f526d48a4fc6fac51a866763c1f` FOREIGN KEY (`membreCoIdpers`) REFERENCES `membreco` (`idpers`);

--
-- Contraintes pour la table `membreco`
--
ALTER TABLE `membreco`
  ADD CONSTRAINT `FK_10b5618cfd13f4f3007632c79d3` FOREIGN KEY (`commissionIdComi`) REFERENCES `commission` (`idComi`);

--
-- Contraintes pour la table `seminariste`
--
ALTER TABLE `seminariste`
  ADD CONSTRAINT `FK_4fa043b6b28dd9b573e81709fc9` FOREIGN KEY (`dortoirIdDortoir`) REFERENCES `dortoir` (`idDortoir`),
  ADD CONSTRAINT `FK_fc545cf92194756884cc9ececd1` FOREIGN KEY (`membreCoIdpers`) REFERENCES `membreco` (`idpers`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
