import httpServer from './app';
import { initLotClosureCheck } from './services/lot.service';
import prismaService from './services/prisma.service';

const PORT = process.env.PORT || 3001;

prismaService.connect()
  .then(() => {
    const server = httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);

      initLotClosureCheck();
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  }); 
