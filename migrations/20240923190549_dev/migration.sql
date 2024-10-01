-- CreateTable
CREATE TABLE `Products` (
    `id` VARCHAR(191) NOT NULL,
    `categoriesId` VARCHAR(191) NULL,
    `shopId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `hasVariants` BOOLEAN NOT NULL DEFAULT false,
    `variants` JSON NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `descriptionHtml` VARCHAR(191) NOT NULL,
    `actions` JSON NOT NULL,
    `fields` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `id` VARCHAR(191) NOT NULL,
    `shopId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categories` ADD CONSTRAINT `Categories_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
