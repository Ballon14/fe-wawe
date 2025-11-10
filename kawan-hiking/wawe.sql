CREATE TABLE `destinations` (
  `id` int(11) NOT NULL,
  `nama_destinasi` varchar(255) NOT NULL COMMENT 'Nama destinasi wisata',
  `lokasi` varchar(255) DEFAULT NULL COMMENT 'Lokasi destinasi',
  `ketinggian` varchar(100) DEFAULT NULL COMMENT 'Ketinggian destinasi (dalam meter atau feet)',
  `kesulitan` varchar(50) DEFAULT NULL COMMENT 'Level kesulitan (mudah, sedang, sulit)',
  `durasi` varchar(100) DEFAULT NULL COMMENT 'Durasi perjalanan atau estimasi waktu',
  `deskripsi` text DEFAULT NULL COMMENT 'Deskripsi lengkap destinasi',
  `jalur_pendakian` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array JSON jalur pendakian yang tersedia' CHECK (json_valid(`jalur_pendakian`)),
  `gambar` text DEFAULT NULL COMMENT 'URL atau path gambar destinasi',
  `fasilitas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array JSON fasilitas yang tersedia' CHECK (json_valid(`fasilitas`)),
  `tips` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array JSON tips dan saran' CHECK (json_valid(`tips`)),
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'Waktu pembuatan record',
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Waktu update record terakhir'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`id`, `nama_destinasi`, `lokasi`, `ketinggian`, `kesulitan`, `durasi`, `deskripsi`, `jalur_pendakian`, `gambar`, `fasilitas`, `tips`, `created_at`, `updated_at`) VALUES
(5, 'Gunung Rinjani', 'Lombok, Nusa Tenggara Barat', '3.726 mdpl', 'Sulit', '3 hari 2 malam', 'Gunung berapi tertinggi kedua di Indonesia dengan pemandangan danau kawah Segara Anak yang memukau.', '[\"Sembalun\", \"Senaru\", \"Aik Berik\"]', 'uploads/images/rinjani.jpg', '[\"Pos Pendakian\", \"Toilet di pos\", \"Jasa Porter\", \"Warung (terbatas)\"]', '[\"Latihan fisik intensif diperlukan\", \"Bawa pakaian sangat hangat\", \"Aklimatisasi penting untuk menghindari AMS\"]', '2025-11-01 00:31:09', '2025-11-01 00:31:09'),
(6, 'Gunung Semeru', 'Lumajang, Jawa Timur', '3.676 mdpl', 'Sulit', '2 hari 1 malam (sampai Kalimati)', 'Gunung tertinggi di Pulau Jawa dengan puncak Mahameru. Terkenal dengan tanjakan cinta dan Ranu Kumbolo.', '[\"Ranu Pane\"]', 'uploads/images/semeru.jpg', '[\"Basecamp Ranu Pane\", \"Toilet\", \"Warung\", \"Pos Perizinan\"]', '[\"Waspadai gas beracun di puncak\", \"Bawa surat keterangan sehat\", \"Mulai summit attack dari Kalimati dini hari\"]', '2025-11-01 00:31:09', '2025-11-01 00:31:09'),
(7, 'Gunung Gede', 'Cianjur/Sukabumi, Jawa Barat', '2.958 mdpl', 'Sedang', '2 hari 1 malam', 'Terkenal dengan alun-alun Surya Kencana, padang edelweiss yang luas di puncaknya.', '[\"Cibodas\", \"Gunung Putri\", \"Salabintana\"]', 'uploads/images/gede.jpg', '[\"Pos Perizinan\", \"Toilet\", \"Sumber Mata Air (Kandang Badak)\", \"Area Berkemah\"]', '[\"Booking online jauh-jauh hari karena kuota terbatas\", \"Hati-hati di jalur air panas (via Cibodas)\", \"Bawa air cukup via jalur Putri\"]', '2025-11-01 00:31:09', '2025-11-01 00:31:09'),
(8, 'Gunung Prau', 'Dieng, Wonosobo, Jawa Tengah', '2.565 mdpl', 'Mudah', '4-6 jam (pulang pergi)', 'Populer untuk pemula, menawarkan pemandangan Golden Sunrise terbaik dengan latar Gunung Sindoro dan Sumbing.', '[\"Patak Banteng\", \"Dieng\", \"Wates\"]', 'uploads/images/prau.jpg', '[\"Basecamp (registrasi, toilet, warung)\", \"Area Parkir\", \"Ojek (ke titik awal)\"]', '[\"Jalur Patak Banteng adalah yang tercepat namun terjal\", \"Suhu bisa sangat dingin (di bawah 0°C)\", \"Datang saat musim kemarau\"]', '2025-11-01 00:31:09', '2025-11-01 00:31:09');

-- --------------------------------------------------------

--
-- Table structure for table `guides`
--

CREATE TABLE `guides` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL COMMENT 'Nama lengkap guide',
  `email` varchar(255) DEFAULT NULL COMMENT 'Email guide',
  `alamat` text DEFAULT NULL COMMENT 'Alamat guide',
  `pengalaman` varchar(255) DEFAULT NULL COMMENT 'Pengalaman guide (misal: 5 tahun)',
  `spesialisasi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array JSON destinasi atau lokasi yang dikuasai' CHECK (json_valid(`spesialisasi`)),
  `rating` decimal(3,2) DEFAULT NULL COMMENT 'Rating guide (0.00 - 5.00)',
  `deskripsi` text DEFAULT NULL COMMENT 'Deskripsi lengkap guide',
  `foto` varchar(500) DEFAULT NULL COMMENT 'URL atau path foto guide',
  `sertifikat` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array JSON sertifikat atau lisensi yang dimiliki' CHECK (json_valid(`sertifikat`)),
  `status` varchar(20) DEFAULT 'aktif' COMMENT 'Status guide (aktif, tidak aktif)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'Waktu pembuatan record',
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Waktu update record terakhir'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `guides`
--

INSERT INTO `guides` (`id`, `nama`, `email`, `alamat`, `pengalaman`, `spesialisasi`, `rating`, `deskripsi`, `foto`, `sertifikat`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Budi Santoso', 'budi.santoso@example.com', 'Jl. Merapi No. 10, Yogyakarta, DIY', '8 tahun', '[\"Gunung Berapi\", \"Pendakian Jarak Jauh\", \"Fotografi Alam\"]', 4.80, 'Pemandu senior dengan spesialisasi gunung berapi di Jawa. Sangat sabar dan mengutamakan keselamatan.', 'uploads/guides/budi_santoso.jpg', '[\"Sertifikat Pemandu Gunung APGI\", \"Lisensi Pemandu Geowisata\"]', 'aktif', '2025-11-01 00:36:00', '2025-11-01 00:36:00'),
(2, 'Siti Aminah', 'siti.aminah@example.com', 'Desa Senaru, Lombok Utara, NTB', '5 tahun', '[\"Gunung Rinjani\", \"Trekking Keluarga\", \"Budaya Lokal\"]', 4.90, 'Pemandu lokal Rinjani yang fasih berbahasa Inggris. Berpengalaman membawa keluarga dan grup besar.', 'uploads/guides/siti_aminah.jpg', '[\"Sertifikat Pemandu Rinjani\", \"Sertifikat Pertolongan Pertama\"]', 'aktif', '2025-11-01 00:36:00', '2025-11-01 00:36:00'),
(3, 'Eka Wijaya', 'eka.wijaya@example.com', 'Jl. Cendrawasih No. 3, Wamena, Papua', '10 tahun', '[\"Pegunungan Papua\", \"Ekspedisi\", \"Survival Hutan\"]', 4.70, 'Spesialis ekspedisi di medan sulit seperti Carstensz Pyramid dan Lembah Baliem. Memiliki keahlian survival yang tinggi.', 'uploads/guides/eka_wijaya.jpg', '[\"Lisensi Pemandu Ekspedisi\", \"Sertifikat Navigasi Darat\"]', 'aktif', '2025-11-01 00:36:00', '2025-11-01 00:41:08');

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `action` varchar(15) NOT NULL,
  `trip_type` varchar(20) NOT NULL,
  `trip_id` int(11) DEFAULT NULL,
  `request_body` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `open_trips`
--

CREATE TABLE `open_trips` (
  `id` int(11) NOT NULL,
  `nama_trip` varchar(255) NOT NULL,
  `tanggal_berangkat` date NOT NULL,
  `durasi` int(11) NOT NULL,
  `kuota` int(11) NOT NULL,
  `harga_per_orang` int(11) NOT NULL,
  `fasilitas` text DEFAULT NULL,
  `itinerary` text DEFAULT NULL,
  `dokumentasi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dokumentasi`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `dilaksanakan` tinyint(1) DEFAULT 0 COMMENT '0 = belum, 1 = sudah dilaksanakan'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `open_trips`
--

INSERT INTO `open_trips` (`id`, `nama_trip`, `tanggal_berangkat`, `durasi`, `kuota`, `harga_per_orang`, `fasilitas`, `itinerary`, `dokumentasi`, `created_at`, `updated_at`, `dilaksanakan`) VALUES
(1, 'Explore Bromo Midnight 2D1N', '2025-11-15', 2, 20, 750000, 'Transportasi AC (Meeting Point Surabaya)\nJeep Bromo\nTiket Masuk Taman Nasional\nHomestay 1 Malam\nMakan 1x (Breakfast)\nGuide Lokal', 'Hari 1: Penjemputan di meeting point (23:00), perjalanan menuju Bromo.\nHari 2: Tiba di rest area, ganti Jeep. Explore Penanjakan (sunrise), Kawah Bromo, Pasir Berbisik, dan Bukit Teletubbies. Kembali ke meeting point.', '{\"notes\": \"Dokumentasi standar (foto) oleh tim kami. Harap membawa jaket tebal, suhu bisa sangat dingin.\"}', '2025-10-31 17:15:51', '2025-10-31 17:15:51', 0),
(2, 'Dieng Plateau Golden Sunrise 3D2N', '2025-12-05', 3, 15, 950000, 'Transportasi AC (Meeting Point Jakarta)\nHomestay 2 Malam (Share room)\nMakan 5x\nTiket Candi Arjuna\nTiket Kawah Sikidang\nTiket Telaga Warna\nGuide', 'Hari 1: Perjalanan malam dari Jakarta ke Dieng.\nHari 2: Tiba di Dieng, check-in, explore Candi Arjuna & Kawah Sikidang.\nHari 3: Morning call, hunting sunrise Sikunir. Explore Telaga Warna & Batu Ratapan Angin. Perjalanan pulang ke Jakarta.', '{\"notes\": \"Trip ini memerlukan fisik yang cukup fit untuk trekking ringan. Bawa obat-obatan pribadi jika diperlukan.\"}', '2025-10-31 17:15:51', '2025-10-31 17:15:51', 0),
(3, 'Sailing & Snorkeling Karimunjawa', '2025-11-28', 4, 30, 1850000, 'Tiket Kapal Cepat PP (Jepara)\nHomestay AC 3 Malam\nKapal untuk hopping island\nAlat snorkeling (masker, snorkel, fin)\nMakan 6x (termasuk BBQ ikan 1x)\nDokumentasi underwater (GoPro)\nGuide HPI', 'Hari 1: Meeting point Pelabuhan Jepara, menyeberang ke Karimunjawa, check-in.\nHari 2: Hopping island (Pulau Menjangan Kecil, Gosong Cemara), snorkeling.\nHari 3: Hopping island (Pulau Geleang, Tanjung Gelam), BBQ di pantai, sunset viewing.\nHari 4: Check-out, beli oleh-oleh, kembali ke Jepara.', '{\"notes\": \"Jadwal kapal sangat bergantung pada cuaca. Ada kemungkinan delay atau pembatalan jika cuaca buruk.\", \"include\": \"Dokumentasi underwater (GoPro)\"}', '2025-10-31 17:15:51', '2025-10-31 17:15:51', 0);

-- --------------------------------------------------------

--
-- Table structure for table `private_trips`
--

CREATE TABLE `private_trips` (
  `id` int(11) NOT NULL,
  `destinasi` varchar(255) NOT NULL,
  `min_peserta` int(11) NOT NULL,
  `harga_paket` int(11) NOT NULL,
  `paket_pilihan` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`paket_pilihan`)),
  `custom_form` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_form`)),
  `estimasi_biaya` int(11) DEFAULT NULL,
  `dokumentasi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dokumentasi`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `dilaksanakan` tinyint(1) DEFAULT 0 COMMENT '0 = belum, 1 = sudah dilaksanakan'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(200) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `created_at`) VALUES
(4, 'admin', '$2b$10$MVp0.3aDBnnsZBpHNGE64ehAraou4dGuGRMu3wUlLLHqJxt3F4DFq', 'user', '2025-10-31 18:57:52'),
(5, 'iqbal', '$2b$10$IoIDciVDNUv4f0DCvxflMugXfod/d9u6PBBZ.zUsi08B.Vx2hnRm6', 'user', '2025-10-31 23:44:04'),
(6, 'kawanghiking', '$2b$10$odBlZgCiXzLwWn8ukTZnPeRt2zXJuuT0Xio7IaiUs3.0YkGx5IVE2', 'admin', '2025-11-01 00:50:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nama_destinasi` (`nama_destinasi`),
  ADD KEY `idx_lokasi` (`lokasi`),
  ADD KEY `idx_kesulitan` (`kesulitan`);

--
-- Indexes for table `guides`
--
ALTER TABLE `guides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nama` (`nama`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_rating` (`rating`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `open_trips`
--
ALTER TABLE `open_trips`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `private_trips`
--
ALTER TABLE `private_trips`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `guides`
--
ALTER TABLE `guides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `open_trips`
--
ALTER TABLE `open_trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `private_trips`
--
ALTER TABLE `private_trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
