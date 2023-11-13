// Dummy data for the list of files
const filesData = [
  {
    fileName: "logTesting 1 ~ 12-22-2023.log",
    size: "100kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service1/logs/logTesting 1 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 2 ~ 12-22-2023.log",
    size: "200kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service2/logs/logTesting 2 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 3 ~ 12-22-2023.log",
    size: "400kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service3/logs/logTesting 3 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 4 ~ 12-22-2023.log",
    size: "150kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service4/logs/logTesting 4 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 5 ~ 12-22-2023.log",
    size: "300kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service5/logs/logTesting 5 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 6 ~ 12-22-2023.log",
    size: "250kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service6/logs/logTesting 6 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 7 ~ 12-22-2023.log",
    size: "180kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service7/logs/logTesting 7 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 8 ~ 12-22-2023.log",
    size: "220kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service8/logs/logTesting 8 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 9 ~ 12-22-2023.log",
    size: "350kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service9/logs/logTesting 9 ~ 12-22-2023.log",
  },
  {
    fileName: "logTesting 10 ~ 12-22-2023.log",
    size: "280kb",
    serviceName: "IDEAL.war",
    location: "C:/impl_ideal6/service10/logs/logTesting 10 ~ 12-22-2023.log",
  },
  // Add more entries as needed
];

// Dummy data for the list of services
const servicesData = [
  {
    serviceName: "IDEAL.war",
    logPath:
      "C:\\IMPL_IDEAL6\\wildfly-8.22_uat\\standalone\\deployments\\IDEAL.war\\log",
    size: "200MB",
  },
  {
    serviceName: "pm2",
    logPath:
      "C:\\IMPL_IDEAL6\\wildfly-8.22_uat\\standalone\\deployments\\IDEAL.war\\log",
    size: "200MB",
  },
  {
    serviceName: "worker",
    logPath:
      "C:\\IMPL_IDEAL6\\wildfly-8.22_uat\\standalone\\deployments\\IDEAL.war\\log",
    size: "200MB",
  },
  // Add more entries as needed
];

module.exports = {
  filesData,
  servicesData,
};
