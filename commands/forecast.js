module.exports = {
  name: "forecast",
  execute(Discord, request, send, message, args, userLocation) {
    if (!userLocation) {
      send("Please provide a location");
      return;
    }
    message.channel.send("Collecting Data...").then((msg) => {
      request(
        `http://api.weatherapi.com/v1/forecast.json?key=439e86839c264d0ca5d70022202712&q=${userLocation}`,
        { json: true },
        (err, res, body) => {
          if (err) {
            return console.log(err);
          }

          var forecastType = args.pop();

          var hourForecast = body.forecast.forecastday[0].hour;
          var astroForecast = body.forecast.forecastday[0].astro;
          var dayForecast = body.forecast.forecastday[0].day;

          function checkForUndefined(value) {
            for (let i = 0; i < value.length; i++) {
              if (typeof value[i] === undefined) {
                return;
              }
            }
          }

          checkForUndefined(hourForecast);
          checkForUndefined(astroForecast);
          checkForUndefined(dayForecast);

          hour = () => {
            for (let i = 0; i < hourForecast.length; i++) {
              var currentHour = hourForecast[i];

              var embed = new Discord.MessageEmbed()
                .setTitle(`${currentHour.time}`)
                .setColor("#9b34eb")
                .setThumbnail(`https:${currentHour.condition.icon}`)
                .addFields(
                  {
                    name: "Condition:",
                    value: currentHour.condition.text,
                  },
                  {
                    name: "Temperature (Celsius)",
                    value: `${currentHour.temp_c}\u00B0C`,
                    inline: true,
                  },
                  {
                    name: "Temperature (Fahrenheit)",
                    value: `${currentHour.temp_f}\u00B0F`,
                    inline: true,
                  },
                  {
                    name: "Feels Like ",
                    value: `${currentHour.feelslike_c}\u00B0C or ${currentHour.feelslike_f}\u00B0F`,
                    inline: true,
                  },
                  {
                    name: "Precipitation: ",
                    value: `${currentHour.precip_mm}mm`,
                    inline: true,
                  },
                  {
                    name: "Change of rain",
                    value: `${currentHour.chance_of_rain}%`,
                    inline: true,
                  },
                  {
                    name: "Change of snow",
                    value: `${currentHour.chance_of_snow}%`,
                    inline: true,
                  },
                  {
                    name: "Wind Speed:",
                    value: `${currentHour.wind_kph} km/h`,
                    inline: true,
                  },
                  {
                    name: "Wind Direction: ",
                    value: currentHour.wind_dir,
                    inline: true,
                  },
                  {
                    name: "Humidity: ",
                    value: `${currentHour.humidity}%`,
                    inline: true,
                  },
                  {
                    name: "Visibility: ",
                    value: `${currentHour.vis_km}km`,
                    inline: true,
                  }
                );

              send(embed);

              if (currentHour.chance_of_rain >= 40) {
                send(
                  `------------------------------------------------------------------------------\n\n**!! WARNING !!**\n\nThe chance of rain is ${dayForecast.daily_chance_of_rain}%.\nI suggest taking an umbrella or a rain coat when going out\n------------------------------------------------------------------------------`
                );
              }
            }
          };

          astro = () => {
            console.log(astroForecast);

            var embed = new Discord.MessageEmbed()
              .setTitle("Today")
              .setColor("#9b34eb")
              .addFields(
                {
                  name: "Sunrise",
                  value: `${astroForecast.sunrise}`,
                  inline: true,
                },
                {
                  name: "Sunset",
                  value: `${astroForecast.sunset}`,
                  inline: true,
                },
                {
                  name: "Moonrise",
                  value: `${astroForecast.moonrise}`,
                  inline: true,
                },
                {
                  name: "Moonset",
                  value: `${astroForecast.moonset}`,
                  inline: true,
                },
                {
                  name: "Moon Phase",
                  value: `${astroForecast.moon_phase}`,
                  inline: true,
                },
                {
                  name: "Moon Illumination",
                  value: `${astroForecast.moon_illumination} lx`,
                  inline: true,
                }
              );

            send(embed);
          };

          day = () => {
            console.log(dayForecast);

            var embed = new Discord.MessageEmbed()
              .setTitle("Today")
              .setColor("#9b34eb")
              .setDescription(`${dayForecast.condition.text}`)
              .setThumbnail(`https:${dayForecast.condition.icon}`)
              .addFields(
                {
                  name: "Minimum Temperature",
                  value: `${dayForecast.mintemp_c}\u00B0C or ${dayForecast.mintemp_f}\u00B0F`,
                  inline: true,
                },
                {
                  name: "Maximum Temperature",
                  value: `${dayForecast.maxtemp_c}\u00B0C or ${dayForecast.maxtemp_f}\u00B0F`,
                  inline: true,
                },
                {
                  name: "Average Temperature",
                  value: `${dayForecast.avgtemp_c}\u00B0C or ${dayForecast.avgtemp_f}\u00B0F`,
                  inline: true,
                },
                {
                  name: "Maximum Wind Speed",
                  value: `${dayForecast.maxwind_kph}km/h`,
                  inline: true,
                },
                {
                  name: "Total Precipitation",
                  value: `${dayForecast.totalprecip_mm}mm`,
                  inline: true,
                },
                {
                  name: "Average Visible Distance",
                  value: `${dayForecast.avgvis_km}km`,
                  inline: true,
                },
                {
                  name: "Average Humidity",
                  value: `${dayForecast.avghumidity}%`,
                  inline: true,
                },
                {
                  name: "Chance of rain",
                  value: `${dayForecast.daily_chance_of_rain}%`,
                  inline: true,
                },
                {
                  name: "Chance of snow",
                  value: `${dayForecast.daily_chance_of_snow}%`,
                  inline: true,
                },
                {
                  name: "UV Index",
                  value: `${dayForecast.uv}`,
                  inline: true,
                }
              );

            send(embed);

            // Making the user cautious of the weather
            if (dayForecast.uv >= 7) {
              send(
                `------------------------------------------------------------------------------\n\n**!! WARNING !!**\n\nThe UV Index is above 7, which is considered extreme.\nIf you live in "${userLocation}", please **don't** leave your house without applying sunscreen.\n------------------------------------------------------------------------------`
              );
            }

            if (dayForecast.daily_chance_of_rain >= 40) {
              send(
                `------------------------------------------------------------------------------\n\n**!! WARNING !!**\n\nThe chance of rain is ${dayForecast.daily_chance_of_rain}%.\nI suggest taking an umbrella or a rain coat when going out\n------------------------------------------------------------------------------`
              );
            }
          };

          if (forecastType === "hour") {
            hour();
          } else if (forecastType === "astro") {
            astro();
          } else if (forecastType === "day") {
            day();
          } else {
            send('Please select by "hour", "astro" or "day"');
          }

          msg.delete();
        }
      );
    });
  },
};
