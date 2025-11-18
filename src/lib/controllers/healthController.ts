import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import RedisService from '../redis';

export const healthCheck = async (request: NextRequest) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      server: 'up'
    },
    memory: process.memoryUsage(),
    version: process.version,
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthcheck.services.database = 'up';
    } else {
      healthcheck.services.database = 'down';
      healthcheck.message = 'Database connection issue';
    }
  } catch (error) {
    healthcheck.services.database = 'error';
    healthcheck.message = 'Database health check failed';
  }

  try {
    // Check Redis connection (simplified check)
    const redis = new RedisService();
    healthcheck.services.redis = 'up'; // Assume Redis is working if no errors
  } catch (error) {
    healthcheck.services.redis = 'error';
  }

  // Determine overall health status
  const isHealthy = healthcheck.services.database === 'up' &&
                   healthcheck.services.redis !== 'error' &&
                   healthcheck.services.server === 'up';

  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(healthcheck, { status: statusCode });
};

export const detailedHealthCheck = async (request: NextRequest) => {
  const detailedHealth = {
    timestamp: Date.now(),
    uptime: process.uptime(),
    services: {
      database: {
        status: 'unknown',
        connectionState: mongoose.connection.readyState,
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      } as any,
      redis: {
        status: 'unknown',
        url: process.env.REDIS_URL ? 'configured' : 'not configured'
      } as any,
      server: {
        status: 'up',
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    },
    system: {
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      loadAverage: require('os').loadavg(),
      totalMemory: require('os').totalmem(),
      freeMemory: require('os').freemem()
    },
    process: {
      pid: process.pid,
      ppid: process.ppid,
      uid: process.getuid ? process.getuid() : 'N/A',
      gid: process.getgid ? process.getgid() : 'N/A'
    }
  };

  try {
    // Detailed MongoDB check
    if (mongoose.connection.db) {
      const dbStats = await mongoose.connection.db.stats();
      detailedHealth.services.database = {
        ...detailedHealth.services.database,
        status: 'up',
        collections: dbStats.collections,
        objects: dbStats.objects,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize
      };
    }
  } catch (error) {
    detailedHealth.services.database.status = 'error';
    (detailedHealth.services.database as any).error = (error as Error).message;
  }

  try {
    // Detailed Redis check
    const redis = new RedisService();
    detailedHealth.services.redis.status = 'up';
  } catch (error) {
    detailedHealth.services.redis.status = 'error';
    (detailedHealth.services.redis as any).error = (error as Error).message;
  }

  const isHealthy = detailedHealth.services.database.status === 'up' &&
                   detailedHealth.services.redis.status !== 'error' &&
                   detailedHealth.services.server.status === 'up';

  return NextResponse.json(detailedHealth, { status: isHealthy ? 200 : 503 });
};

export const readinessCheck = async (request: NextRequest) => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ status: 'not ready', message: 'Database not connected' }, { status: 503 });
    }

    return NextResponse.json({ status: 'ready', message: 'Service is ready to accept requests' });
  } catch (error) {
    return NextResponse.json({ status: 'not ready', message: 'Service not ready' }, { status: 503 });
  }
};

export const metrics = async (request: NextRequest) => {
  const metrics = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: Date.now(),
    requests: {
      total: (global as any).requestCount || 0,
      active: (global as any).activeRequests || 0
    }
  };

  return NextResponse.json(metrics);
};