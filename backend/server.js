import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const [{ default: app }, { default: connectDB }] = await Promise.all([
    import('./app.js'),
    import('./config/db.js'),
  ]);

  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 TARS 360° API running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
