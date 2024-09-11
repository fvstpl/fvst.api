import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function verifyShopOwnership(req: Request, res: Response, next: NextFunction) {
  const userId = req.user.id; // Załóżmy, że `user` jest dodany do req przez middleware autoryzacji
  const shopId = req.params.shopId;

  try {
    const shop = await prisma.shops.findUnique({
      where: { id: shopId },
      include: { user: true } // Zakładając, że mamy relację z `user`
    });

    if (!shop) {
      return res.status(404).json({ error: true, code: 404, message: 'Shop not found' });
    }

    if (shop.userId !== userId) {
      return res.status(403).json({ error: true, code: 403, message: 'Forbidden: Not the owner of this shop' });
    }

    req.shop = shop; // Dodajemy shop do req, aby był dostępny w kolejnych middleware'ach i routach
    next();
  } catch (error) {
    console.error('Error verifying shop ownership', error);
    res.status(500).json({ error: true, code: 500, message: 'Internal server error' });
  }
}
